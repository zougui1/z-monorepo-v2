import {
  parseSafeHTML,
  elementParsers,
  getTextAlign,
  ElementParser,
} from './utils';
import type { DescriptionTree, DescriptionNode } from './types';

const getDescriptionTree = (descriptionElement: Element): DescriptionTree => {
  return {
    type: 'root',
    text: descriptionElement.textContent || '',
    textAlign: getTextAlign(descriptionElement),
    children: getDescriptionNodes(descriptionElement),
  };
}

const getDescriptionNodes = (element: Element): DescriptionNode[] => {
  const descriptionNodes: DescriptionNode[] = [];

  const childNodes = Array.from(element.childNodes || []);
  const children = Array.from(element.children || []);
  const state = { elementIndex: 0 };

  for (const node of childNodes) {
    const childElement = children[state.elementIndex];
    const nodeName = node.nodeName.toLowerCase();
    const data = { node, element: childElement };
    const parser = (elementParsers as Record<string, ElementParser>)[nodeName] || elementParsers.unknown;
    const newDescriptionNode = parser(data, state, getDescriptionNodes);

    if (newDescriptionNode) {
      descriptionNodes.push(newDescriptionNode);
    }
  }

  if (descriptionNodes[0]) {
    descriptionNodes[0].text = descriptionNodes[0].text
      .replace(/^\n/, '')
      .trimStart();

    // if there is no text then this node is useless
    if (!descriptionNodes[0].text) {
      descriptionNodes.shift();
    }
  }

  return descriptionNodes;
}

export const parseDescription = (description: string): DescriptionTree => {
  const { document } = parseSafeHTML(description);
  const rootElement = document.querySelector('body');

  if (rootElement) {
    return getDescriptionTree(rootElement);
  }

  const emptyTree: DescriptionTree = {
    type: 'root',
    text: '',
    children: [],
  };

  return emptyTree;
}
