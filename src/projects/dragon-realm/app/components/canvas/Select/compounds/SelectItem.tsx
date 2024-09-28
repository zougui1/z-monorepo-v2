import { isValidElement, cloneElement, useRef, useState } from 'react';
import { Edges, Html, useSelect as useDreiSelect } from '@react-three/drei';

import { useSelect } from '../context';
import { HoverCard, HoverCardContent } from '~/components/ui/hover-card';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from 'three';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Input } from '~/components/molecules/Input';

export const ChildrenWrapper = ({ children, id }: ChildrenWrapperProps) => {
  const selected = useDreiSelect();
  const [position, setPosition] = useState<[number, number, number] | undefined>(undefined);
  const isSelected = selected.some(selected => selected.userData.id === id);

  console.log('selected', selected)

  const enrichedMesh = cloneElement(children, {
    ref: e => setPosition(e?.position),
    userData: {
      //...children.props.userData,
      id,
    },
    children: (
      <>
        {children.props.children}
        <Edges visible={isSelected} scale={1.1} renderOrder={1000}>
          <meshBasicMaterial transparent color="#fff" depthTest={false} />
        </Edges>
      </>
    )
  });

  return (
    <>
      {enrichedMesh}

      {isSelected && <Html onClick={e => e.stopPropagation()} position={position} style={{ transform: 'translateY(50%) translateX(-50%)' }}>
        <Card className="mt-2">
          <CardContent className="pt-4">
            <Input onClick={e => e.stopPropagation()} placeholder="name" className="min-w-32" />
          </CardContent>
        </Card>
      </Html>}
    </>
  );
}

export const SelectItem = ({ children, id }: SelectItemProps) => {
  const [, setSelected] = useSelect({ required: false }) || [];

  if (!setSelected || !isValidElement(children)) {
    return children;
  }

  return <ChildrenWrapper id={id}>{children}</ChildrenWrapper>
}

export interface SelectItemProps {
  id: string;
  children?: React.ReactNode;
}

interface ChildrenWrapperProps {
  id: string;
  children: React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
}
