import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState, useMemo, useRef } from 'react';
import { Button } from '~/components/atoms/Button';

import { Typography } from '~/components/atoms/Typography';
import { Map } from '~/components/canvas/Map';
import { Dropdown } from '~/components/molecules/Dropdown';
import { DB } from '~/database';
import type { ExitData } from '~/game';
import type { LocationData } from '~/game/location';
import { useWindowEvent } from '~/hooks';
import type { VectorArray } from '~/types';

const isClosedPolygon = (points: VectorArray[]): boolean => {
  if (points.length < 2) {
    return false;
  }

  const [[firstX, firstY]] = points;
  const [lastX, lastY] = points[points.length - 1];

  return firstX === lastX && firstY === lastY;
}

function closeBoundaryPoints(boundaryPoints: VectorArray[]): VectorArray[] {
  if (boundaryPoints.length === 0) return boundaryPoints;

  const closedBoundaryPoints: VectorArray[] = [...boundaryPoints];
  const [firstX, firstY, firstZ] = boundaryPoints[0];
  const [lastX, lastY, lastZ] = boundaryPoints[boundaryPoints.length - 1];

  // Add intermediate points to close the boundary without diagonals
  if (lastX !== firstX || lastY !== firstY) {
    // If the last point's x-coordinate is not equal to the first point's x-coordinate
    if (lastX !== firstX) {
      closedBoundaryPoints.push([firstX, lastY, lastZ]);
    }
    // Finally, ensure that the last point's y-coordinate matches the first point's y-coordinate
    if (lastY !== firstY) {
      closedBoundaryPoints.push([firstX, firstY, lastZ]);
    }
  }

  return closedBoundaryPoints;
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

export default function Areas() {
  const data = useLoaderData<typeof loader>();
  const tempExitDirectionRef = useRef<'vertical' | 'horizontal'>('vertical');
  const [actionType, setActionType] = useState<'boundary' | 'location' | 'exit' | 'none'>('boundary');
  const [boundaryPoints, setBoundaryPoints] = useState<VectorArray[]>(data.boundaryPoints);
  const [tempBoundaryPoint, setTempBoundaryPoint] = useState<VectorArray | undefined>(undefined);
  const [locations, setLocations] = useState<LocationData[]>(data.locations);
  const [tempLocation, setTempLocation] = useState<LocationData | undefined>(undefined);
  const [exits, setExits] = useState<ExitData[]>(data.exits);
  const [tempExit, setTempExit] = useState<ExitData | undefined>(undefined);
  const [highlightedExitId, setHighlightedExitId] = useState<string | undefined>(undefined);
  const [highlightedLocationId, setHighlightedLocationId] = useState<string | undefined>(undefined);
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
    console.log(event.key )
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

  const handleDoubleClick = (type: 'locations' | 'exits') => ({ id }: { id: string }) => {
    if (actionType === 'none') {
      saveData();
      navigate(`/admin/areas/areaId/${type}/${id}`);
    }
  }

  return (
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
              onClick={handleDoubleClick('locations')}
            />
            <Map.Exits highlightId={highlightedExitId} />

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
    </div>
  );
}
