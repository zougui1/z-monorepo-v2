import { secureHttpProtocol } from '@zougui/common.url-utils';

import { getFullHref } from './href';
import { getNodeName, getTextAlign, getElementNode } from './dom';
import type { DescriptionNode, DescriptionLinkNode } from '../types';

export const parseTextNode = (data: ParserData): DescriptionNode => {
  return {
    type: 'text',
    text: data.node.textContent || '',
  };
}

export const parseBrElement = (data: ParserData, state: ParserState): DescriptionNode => {
  state.elementIndex++;

  return {
    type: 'text',
    text: '\n',
  };
}

export const parseAElement = (data: ParserData, state: ParserState): DescriptionNode | undefined => {
  state.elementIndex++;
  if (!data.element) {
    return;
  }

  const img = Array.from(data.element.children).find((node) => {
    return getNodeName(node) === 'img';
  });
  const href = data.element.attributes.getNamedItem('href')?.value;
  const fullHref = href && getFullHref(href, 'https://furaffinity.net');

  const linkNode: DescriptionLinkNode = {
    type: 'link',
    href: fullHref,
    text: data.node.textContent || '',
  };

  if (!img) {
    return linkNode;
  }

  const src = img.attributes.getNamedItem('src')?.value;
  const alt = img.attributes.getNamedItem('alt')?.value;
  const title = img.attributes.getNamedItem('title')?.value;

  return {
    ...linkNode,
    src: src && secureHttpProtocol(src),
    alt,
    title,
  };
}

export const parseUnknownElement = (data: ParserData, state: ParserState, parseElement: ParseElement): DescriptionNode | undefined => {
  state.elementIndex++;
  const attributes: Record<string, string> = {};

  for (const attribute of data.element?.attributes || []) {
    attributes[attribute.name] = attribute.value;
  }

  return {
    type: 'unknown',
    text: data.node.textContent || '',
    tagName: getNodeName(data.node),
    textAlign: data.element && getTextAlign(data.element),
    attributes,
    children: data.element && parseElement(data.element),
  };
}

export const parseTextElement = (data: ParserData, state: ParserState, parseElement: ParseElement): DescriptionNode => {
  state.elementIndex++;
  return getElementNode(data.node, data.element, parseElement);
}

export const elementParsers = {
  '#text': parseTextNode,
  br: parseBrElement,
  a: parseAElement,
  unknown: parseUnknownElement,
  span: parseTextElement,
  strong: parseTextElement,
} satisfies Record<string, ElementParser>;

export type ElementParser = (
  data: ParserData,
  state: ParserState,
  parseElement: ParseElement,
) => DescriptionNode | undefined;

type ParseElement = (element: Element) => DescriptionNode[];

export interface ParserData {
  node: ChildNode;
  element: Element | undefined;
}

export interface ParserState {
  elementIndex: number;
}
