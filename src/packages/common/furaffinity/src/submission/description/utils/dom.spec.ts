import {
  areChildNodesText,
  getElementStyle,
  getNodeName,
  isTextNode,
  getTextAlign,
  getElementNode,
} from './dom';

describe('areChildNodesText', () => {
  it('should return true when all child nodes are text elements', () => {
    const node = {
      childNodes: new Set([
        { nodeName: '#text' },
        { nodeName: '#TEXT' },
      ]),
    };

    const result = areChildNodesText(node as any);

    expect(result).toBe(true);
  });

  it('should return false when not all child nodes are text elements', () => {
    const node = {
      childNodes: new Set([
        { nodeName: '#text' },
        { nodeName: 'div' },
      ]),
    };

    const result = areChildNodesText(node as any);

    expect(result).toBe(false);
  });
});

describe('getElementStyle', () => {
  it('should return the style from the element', () => {
    const node = {
      attributes: {
        getNamedItem: (property: string) => {
          return {
            style: {
              value: {
                backgroundColor: '#444',
              },
            },
          }[property];
        },
      },
    };

    const result = getElementStyle(node as any);

    expect(result).toEqual({
      backgroundColor: '#444',
    });
  });

  it('should return undefined when the child node has no style attrribute', () => {
    const node = {
      attributes: {
        getNamedItem: () => {},
      },
    };

    const result = getElementStyle(node as any);

    expect(result).toBeUndefined();
  });
});

describe('getNodeName', () => {
  it('should return the node name in lower case', () => {
    const node = {
      nodeName: 'DIV',
    };

    const result = getNodeName(node as any);

    expect(result).toBe('div');
  });
});

describe('isTextNode', () => {
  it('should return true when the node is a text node', () => {
    const node = {
      nodeName: '#TEXT',
    };

    const result = isTextNode(node as any);

    expect(result).toBe(true);
  });

  it('should return false when the node is not a text element', () => {
    const node = {
      nodeName: 'div',
    };

    const result = isTextNode(node as any);

    expect(result).toBe(false);
  });
});

describe('getTextAlign', () => {
  it('should return left when the element has no class', () => {
    const element = {
      attributes: {
        getNamedItem: () => {},
      },
    };

    const result = getTextAlign(element as any);

    expect(result).toBe('left');
  });

  it('should return left when the element has a class but none that indicate a text alignment', () => {
    const element = {
      attributes: {
        getNamedItem: (property: string) => {
          return {
            class: { value: 'bbcode' },
          }[property];
        },
      },
    };

    const result = getTextAlign(element as any);

    expect(result).toBe('left');
  });

  it('should return left when the element has a class that indicates a left text alignment', () => {
    const element = {
      attributes: {
        getNamedItem: (property: string) => {
          return {
            class: { value: 'bbcode-left' },
          }[property];
        },
      },
    };

    const result = getTextAlign(element as any);

    expect(result).toBe('left');
  });

  it('should return right when the element has a class that indicates a right text alignment', () => {
    const element = {
      attributes: {
        getNamedItem: (property: string) => {
          return {
            class: { value: 'bbcode-right' },
          }[property];
        },
      },
    };

    const result = getTextAlign(element as any);

    expect(result).toBe('right');
  });

  it('should return center when the element has a class that indicates a center text alignment', () => {
    const element = {
      attributes: {
        getNamedItem: (property: string) => {
          return {
            class: { value: 'bbcode-center' },
          }[property];
        },
      },
    };

    const result = getTextAlign(element as any);

    expect(result).toBe('center');
  });
});

describe('getElementNode', () => {
  describe('when there is an element', () => {
    it('should return a text only node when all its children are text nodes', () => {
      const node = {
        nodeName: 'SPAN',
        textContent: 'Dragons are nice',
        childNodes: new Set([
          { nodeName: '#text' },
        ]),
      };
      const element = undefined;
      const parseElement = jest.fn();

      const result = getElementNode(node as any, element, parseElement);

      expect(result).toEqual({
        type: 'span',
        text: 'Dragons are nice',
        style: undefined,
      });
      expect(parseElement).not.toBeCalled();
    });

    it('should return a node with not text when there is no text content', () => {
      const node = {
        nodeName: 'SPAN',
        textContent: null,
        childNodes: new Set([
          { nodeName: '#text' },
        ]),
      };
      const element = undefined;
      const parseElement = jest.fn();

      const result = getElementNode(node as any, element, parseElement);

      expect(result).toEqual({
        type: 'span',
        text: '',
        style: undefined,
      });
      expect(parseElement).not.toBeCalled();
    });

    it('should return a text only node with undefined children when not all its children are text nodes', () => {
      const node = {
        nodeName: 'SPAN',
        textContent: 'Dragons are nice',
        childNodes: new Set([
          { nodeName: '#text' },
          { nodeName: 'span' },
        ]),
      };
      const element = undefined;
      const parseElement = jest.fn();

      const result = getElementNode(node as any, element, parseElement);

      expect(result).toEqual({
        type: 'span',
        text: 'Dragons are nice',
        style: undefined,
        children: undefined,
      });
      expect(parseElement).not.toBeCalled();
    });
  });

  describe('when there is no element', () => {
    it('should return a text only node with its style when all its children are text nodes', () => {
      const node = {
        nodeName: 'SPAN',
        textContent: 'Dragons are nice',
        childNodes: new Set([
          { nodeName: '#text' },
        ]),
      };
      const element = {
        attributes: {
          getNamedItem: (property: string) => {
            return {
              style: { value: 'color: #f00' },
            }[property];
          },
        },
      };
      const parseElement = jest.fn();

      const result = getElementNode(node as any, element as any, parseElement);

      expect(result).toEqual({
        type: 'span',
        text: 'Dragons are nice',
        style: 'color: #f00',
      });
      expect(parseElement).not.toBeCalled();
    });

    it('should return a node with not text when there is no text content', () => {
      const node = {
        nodeName: 'SPAN',
        textContent: null,
        childNodes: new Set([
          { nodeName: '#text' },
        ]),
      };
      const element = {
        attributes: {
          getNamedItem: (property: string) => {
            return {
              style: { value: 'color: #f00' },
            }[property];
          },
        },
      };
      const parseElement = jest.fn();

      const result = getElementNode(node as any, element as any, parseElement);

      expect(result).toEqual({
        type: 'span',
        text: '',
        style: 'color: #f00',
      });
      expect(parseElement).not.toBeCalled();
    });

    it('should return a text only node with children when not all its children are text nodes', () => {
      const node = {
        nodeName: 'SPAN',
        textContent: 'Dragons are nice',
        childNodes: new Set([
          { nodeName: '#text' },
          { nodeName: 'span' },
        ]),
      };
      const element = {
        attributes: {
          getNamedItem: () => {},
        },
      };
      const parseElement = jest.fn().mockReturnValue([]);

      const result = getElementNode(node as any, element as any, parseElement);

      expect(result).toEqual({
        type: 'span',
        text: 'Dragons are nice',
        style: undefined,
        children: [],
      });
      expect(parseElement).toBeCalledTimes(1);
      expect(parseElement).toBeCalledWith(element);
    });
  });
});
