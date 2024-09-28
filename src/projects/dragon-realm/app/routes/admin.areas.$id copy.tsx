import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useState, useMemo, useRef, createContext, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedValue } from 'rooks';

import { Button } from '~/components/atoms/Button';
import { Typography } from '~/components/atoms/Typography';
import { Map } from '~/components/canvas/Map';
import { Dialog } from '~/components/molecules/Dialog';
import { Dropdown } from '~/components/molecules/Dropdown';
import { Input } from '~/components/molecules/Input';
import { DataTable, createSortedHead, getCellArrayLength, getCellValue } from '~/components/organisms/DataTable';
import { Form } from '~/components/organisms/Form';
import { DB } from '~/database';
import type { ExitData } from '~/game';
import { BuildingData } from '~/game/building';
import type { LocationData } from '~/game/location';
import { locationSchema } from '~/game/location/parse';
import { buildingSchema } from '~/game/building/parse';
import { VillagerData } from '~/game/villager';
import { useWindowEvent } from '~/hooks';
import type { VectorArray } from '~/types';
import { isClosedPolygon, closeBoundaryPoints } from '~/utils';

type BuildingState = [
  BuildingData | true | undefined,
  React.Dispatch<React.SetStateAction<BuildingData | true | undefined>>,
];

const BuildingContext = createContext<BuildingState | undefined>(undefined);

export const BuildingProvider = ({ children }: BuildingProviderProps) => {
  const state = useState<BuildingData | true | undefined>(undefined);

  return (
    <BuildingContext.Provider value={state}>
      {children}
    </BuildingContext.Provider>
  );
}

export interface BuildingProviderProps {
  children?: React.ReactNode;
}

export const useBuildingContext = (): BuildingState => {
  const context = useContext(BuildingContext);

  if (!context) {
    throw new Error('Cannot use building context outside of the BuildingProvider tree');
  }

  return context;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log('load area')
  if (!params.id) {
    throw new Error('Missing id parameter');
  }

  const area = DB.area.findByObjectId(params.id);

  if (!area) {
    throw json({ message: 'Area not found' }, { status: 404 });
  }

  console.log('return area')
  return area;
}

export default function Area() {
  const data = useLoaderData<typeof loader>();
  const tempExitDirectionRef = useRef<'vertical' | 'horizontal'>('vertical');
  const [actionType, setActionType] = useState<'boundary' | 'location' | 'exit' | 'none'>(() => isClosedPolygon(data.boundaryPoints) ? 'none' : 'boundary');
  const [boundaryPoints, setBoundaryPoints] = useState<VectorArray[]>(data.boundaryPoints);
  const [tempBoundaryPoint, setTempBoundaryPoint] = useState<VectorArray | undefined>(undefined);
  const [locations, setLocations] = useState<LocationData[]>(data.locations);
  const [tempLocation, setTempLocation] = useState<LocationData | undefined>(undefined);
  const [exits, setExits] = useState<ExitData[]>(data.exits);
  const [tempExit, setTempExit] = useState<ExitData | undefined>(undefined);
  const [highlightedExitId, setHighlightedExitId] = useState<string | undefined>(undefined);
  const [highlightedLocationId, setHighlightedLocationId] = useState<string | undefined>(undefined);
  const [currentLocation, setCurrentLocation] = useState<LocationData | undefined>(undefined);
  const [currentExit, setCurrentExit] = useState<ExitData | undefined>(undefined);

  const navigate = useNavigate();

  const areBoundariesClosed = isClosedPolygon(boundaryPoints);


  const mergedBoundaryPoints = useMemo(() => {
    if (!tempBoundaryPoint || areBoundariesClosed || actionType !== 'boundary') {
      return [];
    }

    return [...boundaryPoints.slice(-1), tempBoundaryPoint].map(([x, y]) => [x, y, -1]);
  }, [boundaryPoints, tempBoundaryPoint, areBoundariesClosed, actionType]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>, zoom: number) => {
    if (actionType === 'boundary' && !areBoundariesClosed) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.pageX - rect.x - rect.width / 2) / zoom;
      const y = (rect.height / 2 - event.pageY + rect.y) / zoom;

      setBoundaryPoints(prevBoundaryPoints => {
        if (!prevBoundaryPoints.length) {
          return [[x, y, 1]];
        }

        const [lastX, lastY] = prevBoundaryPoints[prevBoundaryPoints.length - 1];

        const deltaX = Math.abs(lastX - x);
        const deltaY = Math.abs(lastY - y);

        if (deltaX >= deltaY) {
          return [...prevBoundaryPoints, [x, lastY, 1]];
        }

        return [...prevBoundaryPoints, [lastX, y, 1]];
      });
    } else if (actionType === 'location' && tempLocation) {
      setLocations(prevLocations => {
        return [
          ...prevLocations,
          tempLocation,
        ];
      });
    } else if (actionType === 'exit' && tempExit) {
      setExits(prevExits => {
        return [
          ...prevExits,
          tempExit,
        ];
      });
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, zoom: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.pageX - rect.x - rect.width / 2) / zoom;
    const y = (rect.height / 2 - event.pageY + rect.y) / zoom;

    if (actionType === 'boundary') {
      setTempBoundaryPoint(() => {
        if (!boundaryPoints.length) {
          return;
        }

        const [lastX, lastY] = boundaryPoints[boundaryPoints.length - 1];

        const deltaX = Math.abs(lastX - x);
        const deltaY = Math.abs(lastY - y);

        if (deltaX >= deltaY) {
          return [x, lastY, 0];
        }

        return [lastX, y, 0];
      });
    } else if (actionType === 'location') {
      setTempLocation({
        id: `location-${locations.length + 1}`,
        name: `location-${locations.length + 1}`,
        position: [x, y, 0],
        buildings: [],
        villagers: [],
      });
    } else if (actionType === 'exit') {
      setTempExit(tempExit => {
        return {
          id: `exit-${exits.length + 1}`,
          name: `exit-${exits.length + 1}`,
          position: [x, y, 0],
          direction: tempExitDirectionRef.current,
          size: tempExit?.size || 3,
          characterPosition: [0, 0, 0],
        };
      });
    }
  }

  const handleClose = () => {
    setBoundaryPoints(prevBoundaryPoints => {
      if (prevBoundaryPoints.length < 4) {
        console.log('The area must have at least 4 boundary points before closing');
        return prevBoundaryPoints;
      }

      return closeBoundaryPoints(prevBoundaryPoints)
    });
  }

  useWindowEvent('keydown', event => {
    if (event.key === 'z' && event.ctrlKey) {
      if (actionType === 'boundary') {
        setBoundaryPoints(prevBoundaryPoints => {
          if (!prevBoundaryPoints.length) {
            return prevBoundaryPoints;
          }

          return prevBoundaryPoints.slice(0, -1);
        });
      } else if (actionType === 'location') {
        setLocations(prevLocations => {
          if (!prevLocations.length) {
            return prevLocations;
          }

          return prevLocations.slice(0, -1);
        });
      } else if (actionType === 'exit') {
        setExits(prevExits => {
          if (!prevExits.length) {
            return prevExits;
          }

          return prevExits.slice(0, -1);
        });
      }
    } else if (event.key === 'Escape' && ['location', 'exit'].includes(actionType)) {
      setActionType('none');
    }
  }, [actionType]);

  useWindowEvent('wheel', event => {
    if (actionType === 'exit') {
      const delta = 0.1;

      setTempExit(tempExit => {
        if(!tempExit) {
          return tempExit;
        }

        if (event.deltaY <= 0) {
          return {
            ...tempExit,
            size: tempExit.size + delta,
          };
        }

        return {
          ...tempExit,
          size: Math.max(tempExit.size - delta, delta),
        };
      });
    }
  }, [actionType]);

  const handleTempExit = (direction: 'vertical' | 'horizontal') => () => {
    tempExitDirectionRef.current = direction;
    setActionType('exit');
    cleanTemps();
  }

  const cleanTemps = () => {
    setTempBoundaryPoint(undefined);
    setTempLocation(undefined);
    setTempExit(undefined);
  }

  const saveData = () => {
    console.log('TODO: save data to DB');
    setActionType('none');
  }

  const handleDoubleClick = (setter: () => void) => {
    if (actionType === 'none') {
      setter();
    }
  }

  const handleClear = () => {
    setBoundaryPoints([]);
    setLocations([]);
    setExits([]);
    setActionType('boundary');
  }

  const handleSaveLocation = () => {
    console.log('save location changes')
  }

  return (
    <BuildingProvider>
      <div className="w-full flex flex-col items-center gap-6 pb-5" style={{ height: 'calc(100vh - 5rem)' }}>
        <Typography variant="h1">Area</Typography>

        <div className="flex flex-col items-center w-full h-5/6 gap-6">
          <div className="flex gap-6 items-end">
            {!areBoundariesClosed && (
              <Button disabled={boundaryPoints.length < 4} onClick={handleClose}>Close Boundaries</Button>
            )}

            {areBoundariesClosed && (
              <>
                <div className="flex flex-col items-center">
                  <Typography>Locations</Typography>

                  <Button className="w-16" onClick={() => {cleanTemps(); setActionType('location')}}>
                    <Map.Root
                      boundaryPoints={[]}
                      locations={[
                        { id: 'button', name: 'button', position: [0, 0, 0], buildings: [], villagers: [] },
                      ]}
                      exits={[]}
                      zoom={20}
                    >
                      <Map.Locations />
                    </Map.Root>
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Typography>Exits</Typography>

                  <Dropdown.Root>
                    <Dropdown.Trigger asChild>
                      <Button className="w-16">
                        <Map.Root
                          boundaryPoints={[]}
                          locations={[]}
                          exits={[
                            { id: 'button', position: [0, 0, 0], direction: 'vertical', size: 1, characterPosition: [0, 0, 0] },
                          ]}
                          zoom={20}
                        >
                          <Map.Exits />
                        </Map.Root>
                      </Button>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                      <Dropdown.Item onClick={handleTempExit('vertical')}>Vertical</Dropdown.Item>
                      <Dropdown.Item onClick={handleTempExit('horizontal')}>Horizontal</Dropdown.Item>
                    </Dropdown.Content>
                  </Dropdown.Root>
                </div>
              </>
            )}

            <Button onClick={handleClear}>Clear</Button>
          </div>

          <div className="w-full h-5/6">
            <Map.Root
              boundaryPoints={boundaryPoints}
              locations={locations}
              exits={exits}
              className="border border-red-600"
              onClick={handleClick}
              onMouseMove={handleMouseMove}
              zoom={20}
              onMouseLeave={cleanTemps}
            >
              <Map.Boundaries />
              <Map.Locations
                highlightId={highlightedLocationId}
                onClick={location => handleDoubleClick(() => setCurrentLocation(location))}
              />
              <Map.Exits
                highlightId={highlightedExitId}
                onClick={exit => handleDoubleClick(() => setCurrentExit(exit))}
              />

              {actionType === 'boundary' && mergedBoundaryPoints.length > 0 && <Map.Boundaries points={mergedBoundaryPoints} color="#755" />}
              {actionType === 'location' && tempLocation && <Map.Locations locations={[tempLocation]} />}
              {actionType === 'exit' && tempExit && <Map.Exits exits={[tempExit]} />}
            </Map.Root>
          </div>
        </div>

        <div>
          <Button onClick={saveData}>
            Save changes
          </Button>
        </div>

        {currentLocation && <LocationDialog
          location={currentLocation}
          onSubmit={() => { }}
          onClose={() => setCurrentLocation(undefined)}
        />}

        <BuildingWrapper />
      </div>
    </BuildingProvider>
  );
}

const buildingColumns: ColumnDef<BuildingData>[] = [
  {
    accessorKey: 'id',
    header: createSortedHead('ID'),
    cell: getCellValue,
  },
  {
    accessorKey: 'name',
    header: createSortedHead('Name'),
    cell: getCellValue,
  },
  {
    accessorKey: 'villagers',
    header: createSortedHead('Villagers'),
    cell: getCellArrayLength,
  },
  {
    id: 'actions',
    header: () => {
      const [, setBuilding] = useBuildingContext();

      return (
        <Button variant="ghost" className="h-8 w-8 p-0 ml-3.5" onClick={() => setBuilding(true)}>
          <span className="sr-only">New</span>
          <Plus className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const building = row.original;

      return (
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Item>
              <MoreHorizontal className="mr-2 h-4 w-4 invisible" />
              <span>View area</span>
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => console.log('delete area', building._id)}
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
              <span>Delete area</span>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    },
  },
];

const villagerColumns: ColumnDef<VillagerData>[] = [
  {
    accessorKey: 'id',
    header: createSortedHead('ID'),
    cell: getCellValue,
  },
  {
    accessorKey: 'name',
    header: createSortedHead('Name'),
    cell: getCellValue,
  },
  {
    id: 'dialogType',
    accessorFn: villager => String(villager.dialog.type),
    header: createSortedHead('Dialog type'),
    cell: getCellValue,
  },
];

const buildings: BuildingData[] = [
  {
    id: 'dragon-realm:building-1',
    name: 'House',
    villagers: [
      {

      } as any,
    ],
  },
  {
    id: 'dragon-realm:building-2',
    name: 'House',
    villagers: [],
  },
  {
    id: 'dragon-realm:building-3',
    name: 'House',
    villagers: [{}, {}, {}, {}] as any,
  },
  {
    id: 'dragon-realm:building-4',
    name: 'House',
    villagers: [],
  },
  {
    id: 'dragon-realm:building-5',
    name: 'House',
    villagers: [],
  },
  {
    id: 'dragon-realm:building-6',
    name: 'House',
    villagers: [],
  },
  {
    id: 'dragon-realm:building-7',
    name: 'House',
    villagers: [],
  },
  {
    id: 'dragon-realm:building-8',
    name: 'House',
    villagers: [],
  },
];


const villagers: VillagerData[] = [
  {
    id: 'dragon-realm:villager-1',
    name: 'Someone',
    dialog: { type: 'text', text: '' },
  },
  {
    id: 'dragon-realm:villager-2',
    name: 'Someone',
    dialog: { type: 'text', text: '' },
  },
  {
    id: 'dragon-realm:villager-3',
    name: 'Someone',
    dialog: { type: 'text', text: '' },
  },
  {
    id: 'dragon-realm:villager-4',
    name: 'Someone',
    dialog: { type: 'text', text: '' },
  },
  {
    id: 'dragon-realm:villager-5',
    name: 'Someone',
    dialog: { type: 'text', text: '' },
  },
  {
    id: 'dragon-realm:villager-6',
    name: 'Someone',
    dialog: { type: 'text', text: '' },
  },
  {
    id: 'dragon-realm:villager-7',
    name: 'Someone',
    dialog: { type: 'text', text: '' },
  },
  {
    id: 'dragon-realm:villager-8',
    name: 'Someone',
    dialog: { type: 'text', text: '' },
  },
];

export const LocationDialog = ({ location, onSubmit, onClose }: LocationDialogProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const form = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: location,
  });

  const id = form.watch('id');
  const [debouncedId] = useDebouncedValue(id, 200);

  const query = useQuery({
    queryKey: ['areas', 'search', { id: debouncedId }],
    queryFn: () => debouncedId && fetch(`/locations/search?id=${encodeURIComponent(debouncedId)}`).then(res => res.json()),
  });

  const handleSaveChanges = (e: React.MouseEvent) => {
    formRef.current?.requestSubmit(e.currentTarget);
  }

  const handleSubmit = () => {
    console.log('submit');
  }

  const handleNameChange = (handler: (e: React.ChangeEvent) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handler(e);

    if (!form.formState.touchedFields.id) {
      form.setValue('id', e.currentTarget.value);
    }
  }

  return (
    <Dialog.Root open={Boolean(location)} onOpenChange={onClose}>
      <Dialog.Content className="max-w-4xl w-screen">
        <Form.Root {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-10">
            <Dialog.Header>
              <Dialog.Title>Location</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-4">
                <Form.Field
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Form.Item className="flex flex-col">
                      <Form.Label>Name</Form.Label>

                      <Form.Control>
                        <Input {...field} onChange={handleNameChange(field.onChange)} />
                      </Form.Control>

                      <Form.Message />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <Form.Item className="flex flex-col">
                      <Form.Label>ID</Form.Label>

                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>

                      <Form.Message>
                        {query.data?._id && query.data._id !== location._id && 'This ID is already used by another location'}
                      </Form.Message>
                    </Form.Item>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-6">
                <Typography variant="h2" className="w-full text-center">Buildings</Typography>

                <DataTable.Root data={buildings} columns={buildingColumns}>
                  <DataTable.Content>
                    <DataTable.Header />
                    <DataTable.Body />
                  </DataTable.Content>

                  <DataTable.Pagination />
                </DataTable.Root>
              </div>

              <div className="flex flex-col space-y-6">
                <Typography variant="h2" className="w-full text-center">Villagers</Typography>

                <DataTable.Root data={villagers} columns={villagerColumns}>
                  <DataTable.Content>
                    <DataTable.Header />
                    <DataTable.Body />
                  </DataTable.Content>

                  <DataTable.Pagination />
                </DataTable.Root>
              </div>
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={handleSaveChanges} type="submit">
                Save changes
              </Button>

              <Dialog.Close asChild>
                <Button variant="destructive">Cancel</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface LocationDialogProps {
  location: LocationData;
  onSubmit: (location: LocationData) => void;
  onClose: () => void;
}

export const BuildingDialog = ({ building, onSubmit, onClose }: BuildingDialogProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const form = useForm({
    resolver: zodResolver(buildingSchema),
    defaultValues: building,
  });

  const id = form.watch('id');
  const [debouncedId] = useDebouncedValue(id, 200);

  /*const query = useQuery({
    queryKey: ['areas', 'search', { id: debouncedId }],
    queryFn: () => debouncedId && fetch(`/buildings/search?id=${encodeURIComponent(debouncedId)}`).then(res => res.json()),
  });*/

  const handleSaveChanges = (e: React.MouseEvent) => {
    formRef.current?.requestSubmit(e.currentTarget);
  }

  const handleSubmit = () => {
    console.log('submit');
  }

  const handleNameChange = (handler: (e: React.ChangeEvent) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handler(e);

    if (!form.formState.touchedFields.id) {
      form.setValue('id', e.currentTarget.value);
    }
  }

  return (
    <Dialog.Root open={Boolean(building)} onOpenChange={onClose}>
      <Dialog.Content className="max-w-4xl w-screen">
        <Form.Root {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-10">
            <Dialog.Header>
              <Dialog.Title>Building</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-4">
                <Form.Field
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Form.Item className="flex flex-col">
                      <Form.Label>Name</Form.Label>

                      <Form.Control>
                        <Input {...field} onChange={handleNameChange(field.onChange)} />
                      </Form.Control>

                      <Form.Message />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <Form.Item className="flex flex-col">
                      <Form.Label>ID</Form.Label>

                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>

                      <Form.Message>
                        {/*query.data?._id && query.data._id !== building._id && 'This ID is already used by another building'*/}
                      </Form.Message>
                    </Form.Item>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-6">
                <Typography variant="h2" className="w-full text-center">Villagers</Typography>

                <DataTable.Root data={villagers} columns={villagerColumns}>
                  <DataTable.Content>
                    <DataTable.Header />
                    <DataTable.Body />
                  </DataTable.Content>

                  <DataTable.Pagination />
                </DataTable.Root>
              </div>
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={handleSaveChanges} type="submit">
                Save changes
              </Button>

              <Dialog.Close asChild>
                <Button variant="destructive">Cancel</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface BuildingDialogProps {
  building: BuildingData;
  onSubmit: (building: BuildingData) => void;
  onClose: () => void;
}

const BuildingWrapper = () => {
  const [building, setBuilding] = useBuildingContext();

  if (!building) {
    return null;
  }

  return (
    <BuildingDialog building={building || { id: '', name: '', villagers: [] }} onClose={() => setBuilding(undefined)} />
  );
}
