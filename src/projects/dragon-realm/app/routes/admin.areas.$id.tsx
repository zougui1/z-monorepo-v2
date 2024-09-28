import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useState, useMemo, useRef, createContext, useContext, useEffect } from 'react';
import { FieldPath, FieldValues, useForm, useWatch } from 'react-hook-form';
import { useDebouncedValue } from 'rooks';
import zod from 'zod';
import { nanoid } from 'nanoid';

import { Button } from '~/components/atoms/Button';
import { Typography } from '~/components/atoms/Typography';
import { Map } from '~/components/canvas/Map';
import { Dropdown } from '~/components/molecules/Dropdown';
import { Input } from '~/components/molecules/Input';
import { createSortedHead, getCellArrayLength, getCellValue } from '~/components/organisms/DataTable';
import { Form, FormInputProps } from '~/components/organisms/Form';
import { DB } from '~/database';
import { area, type ExitData } from '~/game';
import { areaSchema, exitSchema } from '~/game/area/parse';
import type { BuildingData } from '~/game/building';
import type { LocationData } from '~/game/location';
import { locationSchema } from '~/game/location/parse';
import { buildingSchema } from '~/game/building/parse';
import { villagerSchema } from '~/game/villager/parse';
import type { VillagerData } from '~/game/villager';
import { useWindowEvent } from '~/hooks';
import type { VectorArray } from '~/types';
import { isClosedPolygon, closeBoundaryPoints, jsonSchema } from '~/utils';
import { GameDataDialog } from '~/components/organisms/GameDataDialog';
import { Divider } from '~/components/atoms/Divider';

const DEFAULT_NAMESPACE = 'dragon-realm:';

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

type VillagerState = [
  VillagerData | true | undefined,
  React.Dispatch<React.SetStateAction<VillagerData | true | undefined>>,
];

const VillagerContext = createContext<VillagerState | undefined>(undefined);

export const VillagerProvider = ({ children }: VillagerProviderProps) => {
  const state = useState<VillagerData | true | undefined>(undefined);

  return (
    <VillagerContext.Provider value={state}>
      {children}
    </VillagerContext.Provider>
  );
}

export interface VillagerProviderProps {
  children?: React.ReactNode;
}

export const useVillagerContext = (): VillagerState => {
  const context = useContext(VillagerContext);

  if (!context) {
    throw new Error('Cannot use villager context outside of the VillagerProvider tree');
  }

  return context;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Error('Missing id parameter');
  }

  const area = DB.area.findByObjectId(params.id);

  if (!area) {
    throw json({ message: 'Area not found' }, { status: 404 });
  }

  return area;
}

const requestBodySchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  boundaryPoints: jsonSchema(zod.array(zod.tuple([zod.number(), zod.number(), zod.number()]))),
  //exits: jsonSchema(zod.array(exitSchema)),
  locations: jsonSchema(zod.array(locationSchema)),
});

export const action = async ({ params, request }: ActionFunctionArgs) => {
  if (!params.id) {
    throw json({ message: 'Missing id parameter' }, { status: 400 });
  }

  const body = await request.formData();

  const data = {
    id: body.get('id')?.toString(),
    name: body.get('name')?.toString(),
    boundaryPoints: body.get('boundaryPoints')?.toString(),
    exits: body.get('exits')?.toString(),
    locations: body.get('locations')?.toString(),
  };

  const result = await requestBodySchema.safeParseAsync(data);

  if (result.error) {
    const errors: Record<string, string> = {};

    for (const issue of result.error.issues) {
      errors[issue.path.join('.')] = issue.message;
    }

    return json({ values: body, errors }, { status: 400 });
  }
  //console.log('area', result.data);
  console.log('update', params.id)
  console.log('locations', result.data.locations.map(loc => loc.name))
  await DB.area.updateByObjectId(params.id, result.data);

  return null;
}

export default function Area() {
  const data = useLoaderData<typeof loader>();
  const tempExitDirectionRef = useRef<'vertical' | 'horizontal'>('vertical');
  const [actionType, setActionType] = useState<'boundary' | 'location' | 'exit' | 'none'>(() => isClosedPolygon(data.boundaryPoints) ? 'none' : 'boundary');
  //const [boundaryPoints, setBoundaryPoints] = useState<VectorArray[]>(data.boundaryPoints);
  const [tempBoundaryPoint, setTempBoundaryPoint] = useState<VectorArray | undefined>(undefined);
  //const [locations, setLocations] = useState<LocationData[]>(data.locations);
  const [tempLocation, setTempLocation] = useState<LocationData | undefined>(undefined);
  //const [exits, setExits] = useState<ExitData[]>(data.exits);
  const [tempExit, setTempExit] = useState<ExitData | undefined>(undefined);
  const [highlightedExitId, setHighlightedExitId] = useState<string | undefined>(undefined);
  const [highlightedLocationId, setHighlightedLocationId] = useState<string | undefined>(undefined);
  const [currentLocation, setCurrentLocation] = useState<LocationData | undefined>(undefined);
  const [currentExit, setCurrentExit] = useState<ExitData | undefined>(undefined);
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement | null>(null);
  const form = useForm({
    resolver: zodResolver(areaSchema),
    defaultValues: data,
  });

  const boundaryPoints = form.watch('boundaryPoints');
  const locations = form.watch('locations');
  const exits = form.watch('exits');

  const setBoundaryPoints: React.Dispatch<React.SetStateAction<VectorArray[]>> = value => {
    if (typeof value !== 'function') {
      return form.setValue('boundaryPoints', value);
    }

    form.setValue('boundaryPoints', value(form.getValues('boundaryPoints')));
  }
  const setLocations: React.Dispatch<React.SetStateAction<LocationData[]>> = value => {
    if (typeof value !== 'function') {
      return form.setValue('locations', value);
    }

    form.setValue('locations', value(form.getValues('locations')));
  }
  const setExits: React.Dispatch<React.SetStateAction<ExitData[]>> = value => {
    if (typeof value !== 'function') {
      return form.setValue('exits', value);
    }

    form.setValue('exits', value(form.getValues('exits')));
  }

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
        _id: nanoid(),
        id: `${DEFAULT_NAMESPACE}location-${locations.length + 1}`,
        name: `location-${locations.length + 1}`,
        position: [x, y, 0],
        buildings: [],
        villagers: [],
      });
    } else if (actionType === 'exit') {
      setTempExit(tempExit => {
        return {
          _id: nanoid(),
          id: `${DEFAULT_NAMESPACE}exit-${exits.length + 1}`,
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

  const saveData = form.handleSubmit((data) => {
    console.log('TODO: save data to DB');
    setActionType('none');

    const formData = new FormData();

    formData.set('name', data.name);
    formData.set('id', data.id);
    formData.set('boundaryPoints', JSON.stringify(boundaryPoints));
    formData.set('exits', JSON.stringify(exits));
    formData.set('locations', JSON.stringify(locations));

    fetcher.submit(formData, { method: 'post' });
  });

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

  const handleSaveLocation = (updatedLocation: LocationData) => {
    setLocations(prevLocations => {
      const isNewLocation = prevLocations.every(prevLocation => prevLocation._id !== updatedLocation._id);

      if (isNewLocation) {
        return [...prevLocations, updatedLocation];
      }

      return prevLocations.map(prevLocation => {
        return prevLocation._id === updatedLocation._id ? updatedLocation : prevLocation;
      });
    });
  }

  const handleSaveExit = (updatedExit: ExitData) => {
    setExits(prevExits => {
      const isNewExit = prevExits.every(prevExit => prevExit._id !== updatedExit._id);

      if (isNewExit) {
        return [...prevExits, updatedExit];
      }

      return prevExits.map(prevExit => {
        return prevExit._id === updatedExit._id ? updatedExit : prevExit;
      });
    });
  }

  const deleteLocation = ({ id }: LocationData) => {
    const locations = form.getValues('locations').filter(location => location.id !== id);
    form.setValue('locations', locations);
  }

  const deleteExit = ({ id }: ExitData) => {
    const exits = form.getValues('exits').filter(exit => exit.id !== id);
    form.setValue('exits', exits);
  }

  return (
    <BuildingProvider>
      <VillagerProvider>
        <Form.Root {...form}>
          <fetcher.Form ref={formRef} className="w-full" method="post" onSubmit={saveData}>
            <div className="w-full flex flex-col items-center gap-6 pb-5" style={{ height: 'calc(100vh - 5rem)' }}>
              <Typography variant="h1">Area</Typography>

              <div className="flex flex-col items-center gap-6 w-full overflow-y-auto h-5/6 pr-4">
                <div className="flex gap-4">
                  <Form.Input
                    control={form.control}
                    name="name"
                    label="Name"
                    className="w-[30ch]"
                  />

                  <UniqueInput
                    control={form.control}
                    name="id"
                    label="ID"
                    _id={data._id}
                    getUrl={id => `/areas/search?id=${id}`}
                    className="w-[30ch]"
                  />
                </div>

                <div className="flex flex-col items-center w-full min-h-[1000px] gap-6">
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
              </div>

              <div className="w-full flex flex-col items-center">
                <Divider className="w-full pb-6" />
                <Button onClick={saveData}>
                  Save changes
                </Button>
              </div>

              {currentLocation && <LocationDialog
                location={currentLocation}
                onSubmit={handleSaveLocation}
                onClose={() => setCurrentLocation(undefined)}
                onDelete={() => deleteLocation(currentLocation)}
              />}

              {currentExit && <ExitDialog
                exit={currentExit}
                onSubmit={handleSaveExit}
                onClose={() => setCurrentExit(undefined)}
                onDelete={() => deleteExit(currentExit)}
              />}

              <VillagerWrapper />
            </div>
          </fetcher.Form>
        </Form.Root>
      </VillagerProvider>
    </BuildingProvider>
  );
}

const getBuildingColumns = ({ onDelete }: { onDelete: (building: BuildingData) => void }): ColumnDef<BuildingData>[] => [
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
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 ml-3.5"
          onClick={() => setBuilding({ _id: nanoid(), id: DEFAULT_NAMESPACE, name: '', villagers: [] })}
          type="button"
        >
          <span className="sr-only">New</span>
          <Plus className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const building = row.original;
      const [, setBuilding] = useBuildingContext();

      return (
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Item onClick={() => setBuilding(building)}>
              <MoreHorizontal className="mr-2 h-4 w-4 invisible" />
              <span>Edit building</span>
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => onDelete(building)}
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
              <span>Delete building</span>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    },
  },
];

const getVillagerColumns = ({ onDelete }: { onDelete: (villager: VillagerData) => void }): ColumnDef<VillagerData>[] => [
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
  {
    id: 'actions',
    header: () => {
      const [, setVillager] = useVillagerContext();

      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 ml-3.5"
          onClick={() => setVillager({ _id: nanoid(), id: DEFAULT_NAMESPACE, name: '', dialog: { type: '', text: '' } })}
          type="button"
        >
          <span className="sr-only">New</span>
          <Plus className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const villager = row.original;
      const [, setVillager] = useVillagerContext();

      return (
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Item onClick={() => setVillager(villager)}>
              <MoreHorizontal className="mr-2 h-4 w-4 invisible" />
              <span>Edit villager</span>
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => onDelete(villager)}
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
              <span>Delete villager</span>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    },
  },
];

export const LocationDialog = ({ location, onSubmit, onClose, onDelete }: LocationDialogProps) => {
  const form = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: location,
  });

  const handleSubmit = form.handleSubmit(data => {
    console.log('location: submit')
    onSubmit({
      _id: location._id,
      ...data,
    });
    onClose();
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullId = form.getValues('id');
    const parts = fullId.split(':');
    const id = parts.pop();

    if (
      !form.formState.touchedFields.id &&
      id === form.getValues('name')
    ) {
      form.setValue('id', [...parts, e.currentTarget.value].join(':'));
    }
  }

  const deleteVillager = ({ id }: VillagerData) => {
    const villagers = form.getValues('villagers').filter(villager => villager.id !== id);
    form.setValue('villagers', villagers);
  }

  const deleteBuilding = ({ id }: BuildingData) => {
    const buildings = form.getValues('buildings').filter(building => building.id !== id);
    form.setValue('buildings', buildings);
  }

  const saveBuildingData = (newBuilding: BuildingData) => {
    console.log('newBuilding', newBuilding)
    const buildings = form.getValues('buildings').map(building => {
      if (building._id !== newBuilding._id) {
        return building;
      }

      return newBuilding;
    });
    form.setValue('buildings', buildings);
  }

  return (
    <>
      <GameDataDialog.Root
        title="Location"
        open={Boolean(location)}
        form={form}
        onOpenChange={onClose}
        onSubmit={handleSubmit}
        onDelete={onDelete}
      >
        <GameDataDialog.Fieldset>
          <Form.Input
            control={form.control}
            name="name"
            label="Name"
            onChange={handleNameChange}
          />

          <UniqueInput
            control={form.control}
            name="id"
            label="ID"
            _id={location._id}
            getUrl={id => `/locations/search?id=${encodeURIComponent(id)}`}
          />
        </GameDataDialog.Fieldset>

        <GameDataDialog.Table
          title="Buildings"
          data={form.watch('buildings')}
          columns={getBuildingColumns({ onDelete: deleteBuilding })}
        />

        <GameDataDialog.Table
          title="Villagers"
          data={form.watch('villagers')}
          columns={getVillagerColumns({ onDelete: deleteVillager })}
        />
      </GameDataDialog.Root>

      <BuildingWrapper
        onSubmit={saveBuildingData}
      />
    </>
  );
}

export interface LocationDialogProps {
  location: LocationData;
  onSubmit: (location: LocationData) => void;
  onClose: () => void;
  onDelete: () => void;
}

export const ExitDialog = ({ exit, onSubmit, onClose, onDelete }: ExitDialogProps) => {
  const form = useForm({
    resolver: zodResolver(exitSchema),
    defaultValues: exit,
  });

  const handleSubmit = form.handleSubmit(data => {
    onSubmit({
      _id: exit._id,
      ...data,
    });
    onClose();
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullId = form.getValues('id');
    const parts = fullId.split(':');
    const id = parts.pop();

    if (
      !form.formState.touchedFields.id &&
      id === form.getValues('name')
    ) {
      form.setValue('id', [...parts, e.currentTarget.value].join(':'));
    }
  }

  return (
    <GameDataDialog.Root
      title="Exit"
      open={Boolean(exit)}
      form={form}
      onOpenChange={onClose}
      onSubmit={handleSubmit}
      onDelete={onDelete}
    >
      <GameDataDialog.Fieldset>
        <Form.Input
          control={form.control}
          name="name"
          label="Name"
          onChange={handleNameChange}
        />

        <UniqueInput
          control={form.control}
          name="id"
          label="ID"
          _id={exit._id}
          getUrl={id => `/exits/search?id=${encodeURIComponent(id)}`}
        />
      </GameDataDialog.Fieldset>
    </GameDataDialog.Root>
  );
}

export interface ExitDialogProps {
  exit: ExitData;
  onSubmit: (exit: ExitData) => void;
  onClose: () => void;
  onDelete: () => void;
}

const UniqueInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ _id, getUrl, name, error, label, ...rest }: UniqueInputProps<TFieldValues, TName>) => {
  const value = useWatch({ name });
  const [debouncedValue] = useDebouncedValue(value, 500);

  const query = useQuery({
    queryKey: ['buildings', 'search', { [name]: debouncedValue }],
    queryFn: () => debouncedValue && fetch(getUrl(debouncedValue)).then(res => res.json()),
  });

  const isUnique = !query.data?._id || query.data._id === _id;

  return (
    <Form.Input
      {...rest}
      name={name}
      label={label}
      error={error || (!isUnique ? `This ${label} is already used` : undefined)}
    />
  );
}

export interface UniqueInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends FormInputProps<TFieldValues, TName> {
  _id: string;
  getUrl: (value: string) => string;
}

export const BuildingDialog = ({ building, onSubmit, onClose }: BuildingDialogProps) => {
  const form = useForm({
    resolver: zodResolver(buildingSchema),
    defaultValues: building,
  });

  const handleSubmit = form.handleSubmit(data => {
    console.log('building: submit')
    onSubmit({
      _id: building._id,
      ...data,
    });
    onClose();
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullId = form.getValues('id');
    const parts = fullId.split(':');
    const id = parts.pop();

    if (
      !form.formState.touchedFields.id &&
      id === form.getValues('name')
    ) {
      form.setValue('id', [...parts, e.currentTarget.value].join(':'));
    }
  }

  const handleDelete = ({ id }: VillagerData) => {
    const villagers = form.getValues('villagers').filter(villager => villager.id !== id);
    form.setValue('villagers', villagers);
  }

  return (
    <GameDataDialog.Root
      title="Building"
      open={Boolean(building)}
      form={form}
      onOpenChange={onClose}
      onSubmit={handleSubmit}
    >
      <GameDataDialog.Fieldset>
        <Form.Input
          control={form.control}
          name="name"
          label="Name"
          onChange={handleNameChange}
        />

        <UniqueInput
          control={form.control}
          name="id"
          label="ID"
          _id={building._id}
          getUrl={id => `/buildings/search?id=${encodeURIComponent(id)}`}
        />
      </GameDataDialog.Fieldset>

      <GameDataDialog.Table
        title="Villagers"
        data={form.watch('villagers')}
        columns={getVillagerColumns({ onDelete: handleDelete })}
      />
    </GameDataDialog.Root>
  );
}

export interface BuildingDialogProps {
  building: BuildingData;
  onSubmit: (building: BuildingData) => void;
  onClose: () => void;
}

const BuildingWrapper = ({ onSubmit }: BuildingWrapperProps) => {
  const [building, setBuilding] = useBuildingContext();

  if (!building) {
    return null;
  }

  return (
    <BuildingDialog
      building={building}
      onSubmit={onSubmit}
      onClose={() => setBuilding(undefined)}
    />
  );
}

export interface BuildingWrapperProps {
  onSubmit: (building: BuildingData) => void;
}

export const VillagerDialog = ({ villager, onSubmit, onClose }: VillagerDialogProps) => {
  const form = useForm({
    resolver: zodResolver(villagerSchema),
    defaultValues: villager,
  });

  const handleSubmit = form.handleSubmit(() => {
    console.log('submit');
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullId = form.getValues('id');
    const parts = fullId.split(':');
    const id = parts.pop();

    if (
      !form.formState.touchedFields.id &&
      id === form.getValues('name')
    ) {
      form.setValue('id', [...parts, e.currentTarget.value].join(':'));
    }
  }

  return (
    <GameDataDialog.Root
      title="Villager"
      open={Boolean(villager)}
      form={form}
      onOpenChange={onClose}
      onSubmit={handleSubmit}
    >
      <GameDataDialog.Fieldset>
        <Form.Input
          control={form.control}
          name="name"
          label="Name"
          onChange={handleNameChange}
        />

        <UniqueInput
          control={form.control}
          name="id"
          label="ID"
          _id={villager._id}
          getUrl={id => `/villagers/search?id=${encodeURIComponent(id)}`}
        />
      </GameDataDialog.Fieldset>
    </GameDataDialog.Root>
  );
}

export interface VillagerDialogProps {
  villager: VillagerData;
  onSubmit: (villager: VillagerData) => void;
  onClose: () => void;
}

const VillagerWrapper = () => {
  const [villager, setVillager] = useVillagerContext();

  if (!villager) {
    return null;
  }

  return (
    <VillagerDialog villager={villager} onClose={() => setVillager(undefined)} />
  );
}
