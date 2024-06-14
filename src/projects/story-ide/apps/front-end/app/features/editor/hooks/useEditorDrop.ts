import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';

import { useAppDispatch } from 'app/store';
import { ExplorerDndType } from 'app/features/explorer';

import { openFile, createPane } from '../slice';
import { DropPosition, EditorDndType } from '../enums';

export const useEditorDrop = (paneId: string): [UseEditorDropResult, ConnectDropTarget] => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const position = useRef<DropPosition>(DropPosition.Neutral);
  // used to force an update when the position changes
  const [, forcePositionUpdate] = useState(position.current);

  const dispatch = useAppDispatch();

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: [ExplorerDndType.Node, EditorDndType.Tab],
    hover: (item, monitor) => {
      const element = elementRef.current;

      if(!element) {
        return;
      }

      const coords = monitor.getClientOffset();

      if (!coords) return;

      const rect = element.getBoundingClientRect();
      const relativeClientX = coords.x - rect.left;
      const relativeClientY = coords.y - rect.top;

      if (relativeClientX < (rect.width / 5)) {
        position.current = DropPosition.Left;
        forcePositionUpdate(DropPosition.Left);
        return;
      }

      if (relativeClientX > (rect.width / 5 * 3)) {
        position.current = DropPosition.Right;
        forcePositionUpdate(DropPosition.Right);
        return;
      }

      if (relativeClientY < (rect.height / 7)) {
        position.current = DropPosition.Top;
        forcePositionUpdate(DropPosition.Top);
        return;
      }

      if (relativeClientY > (rect.height / 4 * 3)) {
        position.current = DropPosition.Bottom;
        forcePositionUpdate(DropPosition.Bottom);
        return;
      }

      position.current = DropPosition.Neutral;
      forcePositionUpdate(DropPosition.Neutral);
    },
    drop: item => {
      if (item && typeof item === 'object' && 'path' in item && typeof item.path === 'string') {
        if (position.current === DropPosition.Neutral) {
          dispatch(openFile({ path: item.path, paneId }));
        } else {
          dispatch(createPane({
            position: position.current,
            paneId,
            path: item.path,
          }));
        }
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  }), [dispatch]);

  const connectDropTarget: ConnectDropTarget = element => {
    elementRef.current = element;
    dropRef(element);
  }

  return [
    { isOver, position: position.current },
    connectDropTarget,
  ];
}

export interface UseEditorDropResult {
  position: DropPosition;
  isOver: boolean;
}

export type ConnectDropTarget = (element: HTMLDivElement | null) => void;
