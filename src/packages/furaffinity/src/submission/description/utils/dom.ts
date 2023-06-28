import { DescriptionNode } from '../types';

const reTextAlign = /(left)|(right)|(center)/;
const defaultTextAlign = 'left';

export const isTextNode = (node: ChildNode): boolean => {
  return getNodeName(node) === '#text';
}

export const areChildNodesText = (node: ChildNode): boolean => {
  return Array.from(node.childNodes).every((node) => isTextNode(node));
}

export const getElementStyle = (element: Element): string | undefined => {
  return element.attributes.getNamedItem('style')?.value;
}

export const getNodeName = (node: ChildNode): string => {
  return node.nodeName.toLowerCase();
}

export const getTextAlign = (element: Element): 'left' | 'right' | 'center' => {
  const className = element.attributes.getNamedItem('class')?.value;
  const textAlignMatches = className?.match(reTextAlign);
  const textAlign = (textAlignMatches?.[0] || defaultTextAlign) as 'left' | 'right' | 'center';

  return textAlign;
}

export const getElementNode = (node: ChildNode, element: Element | undefined, parseElement: ParseElement): DescriptionNode => {
  const nodeName = getNodeName(node);
  const text = node.textContent || '';
  const style = element && getElementStyle(element);
  const isTextOnly = areChildNodesText(node);

  const baseNode = {
    type: nodeName,
    text,
    style,
  };

  if (isTextOnly) {
    return baseNode;
  }

  return {
    ...baseNode,
    children: element && parseElement(element),
  };
}

type ParseElement = (element: Element) => DescriptionNode[];
