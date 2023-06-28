import { elementParsers, ParserState } from './elementParsers';

describe('parseTextNode', () => {
  it('should return the text content from the node', () => {
    const data = {
      node: {
        textContent: 'Dragons are nice',
      },
    } as any;

    const result = elementParsers['#text'](data);

    expect(result).toEqual({
      type: 'text',
      text: 'Dragons are nice',
    });
  });

  it('should return an empty string when the text content from the node is null', () => {
    const data = {
      node: {
        textContent: null,
      },
    } as any;

    const result = elementParsers['#text'](data);

    expect(result).toEqual({
      type: 'text',
      text: '',
    });
  });
});

describe('parseBrElement', () => {
  it('should return a new line and update the element index from the state', () => {
    const data = {
      node: {
        textContent: 'Dragons are nice',
      },
    } as any;
    const state: ParserState = { elementIndex: 0 };

    const result = elementParsers.br(data, state);

    expect(result).toEqual({
      type: 'text',
      text: '\n',
    });
    expect(state).toEqual({
      elementIndex: 1,
    });
  });
});

describe('parseAElement', () => {
  describe('when there is no element', () => {
    it('should return undefined and update the element index from the state', () => {
      const data = {
        node: {
          textContent: 'Dragons are nice',
        },
      } as any;
      const state: ParserState = { elementIndex: 0 };

      const result = elementParsers.a(data, state);

      expect(result).toBeUndefined();
      expect(state).toEqual({
        elementIndex: 1,
      });
    });
  });

  describe('when there is an element', () => {
    describe('when there is no img', () => {
      it('should return a link node with text and href and update the element index from the state', () => {
        const data = {
          node: {
            textContent: 'Dragons are nice',
          },
          element: {
            children: new Set([{ nodeName: 'span' }]),
            attributes: {
              getNamedItem: (property: string) => {
                return {
                  href: {
                    value: '/user/Zougui',
                  },
                }[property];
              },
            },
          },
        } as any;
        const state: ParserState = { elementIndex: 0 };

        const result = elementParsers.a(data, state);

        expect(result).toEqual({
          type: 'link',
          href: 'https://furaffinity.net/user/Zougui',
          text: 'Dragons are nice',
        });
        expect(state).toEqual({
          elementIndex: 1,
        });
      });

      it('should return a link node with no text and href and update the element index from the state', () => {
        const data = {
          node: {
            textContent: null,
          },
          element: {
            children: new Set(),
            attributes: {
              getNamedItem: () => {},
            },
          },
        } as any;
        const state: ParserState = { elementIndex: 0 };

        const result = elementParsers.a(data, state);

        expect(result).toEqual({
          type: 'link',
          href: undefined,
          text: '',
        });
        expect(state).toEqual({
          elementIndex: 1,
        });
      });
    });

    describe('when there is an img', () => {
      it('should return a link node with src, alt and title and update the element index from the state', () => {
        const data = {
          node: {
            textContent: 'Dragons are nice',
          },
          element: {
            children: new Set([
              {
                nodeName: 'IMG',
                attributes: {
                  getNamedItem: (property: string) => {
                    return {
                      src: { value: 'http://a.furaffinity.net/view/69' },
                      alt: { value: 'user avatar' },
                      title: { value: 'avatar of Zougui' },
                    }[property];
                  },
                },
              },
            ]),
            attributes: {
              getNamedItem: (property: string) => {
                return {
                  href: {
                    value: '/user/Zougui',
                  },
                }[property];
              },
            },
          },
        } as any;
        const state: ParserState = { elementIndex: 0 };

        const result = elementParsers.a(data, state);

        expect(result).toEqual({
          type: 'link',
          href: 'https://furaffinity.net/user/Zougui',
          text: 'Dragons are nice',
          src: 'https://a.furaffinity.net/view/69',
          alt: 'user avatar',
          title: 'avatar of Zougui',
        });
        expect(state).toEqual({
          elementIndex: 1,
        });
      });

      it('should return a link node with no src, alt and title and update the element index from the state', () => {
        const data = {
          node: {
            textContent: null,
          },
          element: {
            children: new Set([
              {
                nodeName: 'IMG',
                attributes: {
                  getNamedItem: () => {},
                },
              },
            ]),
            attributes: {
              getNamedItem: () => {},
            },
          },
        } as any;
        const state: ParserState = { elementIndex: 0 };

        const result = elementParsers.a(data, state);

        expect(result).toEqual({
          type: 'link',
          href: undefined,
          text: '',
          src: undefined,
          alt: undefined,
          title: undefined,
        });
        expect(state).toEqual({
          elementIndex: 1,
        });
      });
    });
  });
});

describe('parseUnknownElement', () => {
  it('should return an unknown node with its text, name and no attributes and update the element index from the state', () => {
    const data = {
      node: {
        nodeName: 'PRE',
        textContent: 'Dragons are nice',
      },
    } as any;
    const state: ParserState = { elementIndex: 0 };
    const parseElement = jest.fn();

    const result = elementParsers.unknown(data, state, parseElement);

    expect(result).toEqual({
      type: 'unknown',
      text: 'Dragons are nice',
      tagName: 'pre',
      textAligh: undefined,
      attributes: {},
      children: undefined,
    });
    expect(state).toEqual({
      elementIndex: 1,
    });
  });

  it('should return an unknown node with no text and update the element index from the state', () => {
    const data = {
      node: {
        nodeName: 'PRE',
        textContent: null,
      },
    } as any;
    const state: ParserState = { elementIndex: 0 };
    const parseElement = jest.fn();

    const result = elementParsers.unknown(data, state, parseElement);

    expect(result).toEqual({
      type: 'unknown',
      text: '',
      tagName: 'pre',
      textAligh: undefined,
      attributes: {},
      children: undefined,
    });
    expect(state).toEqual({
      elementIndex: 1,
    });
  });

  it('should return an unknown node with all its attributes, text alignment and parse itself and update the element index from the state', () => {
    const data = {
      node: {
        nodeName: 'PRE',
        textContent: null,
      },
      element: {
        attributes: [
          { name: 'class', value: 'bbcode-center' },
          { name: 'style', value: 'color: #f00' },
        ],
      },
    } as any;
    const state: ParserState = { elementIndex: 0 };
    const parseElement = jest.fn().mockReturnValue([]);

    data.element.attributes.getNamedItem = (property: string) => {
      return {
        class: { value: 'bbcode-center' },
        style: { value: 'color: #f00' },
      }[property];
    }

    const result = elementParsers.unknown(data, state, parseElement);

    expect(result).toEqual({
      type: 'unknown',
      text: '',
      tagName: 'pre',
      textAlign: 'center',
      attributes: {
        class: 'bbcode-center',
        style: 'color: #f00',
      },
      children: [],
    });
    expect(state).toEqual({
      elementIndex: 1,
    });
    expect(parseElement).toBeCalledTimes(1);
    expect(parseElement).toBeCalledWith(data.element);
  });
});

describe('parseTextElement', () => {
  describe('as span', () => {
    it('should return a new line and update the element index from the state', () => {
      const data = {
        node: {
          nodeName: 'SPAN',
          textContent: 'Dragons are nice',
          childNodes: new Set([]),
        },
      } as any;
      const state: ParserState = { elementIndex: 0 };
      const parseElement = jest.fn();

      const result = elementParsers.span(data, state, parseElement);

      expect(result).toEqual({
        type: 'span',
        text: 'Dragons are nice',
        style: undefined,
      });
      expect(state).toEqual({
        elementIndex: 1,
      });
    });
  });

  describe('as strong', () => {
    it('should return a new line and update the element index from the state', () => {
      const data = {
        node: {
          nodeName: 'STRONG',
          textContent: 'Dragons are nice',
          childNodes: new Set([]),
        },
      } as any;
      const state: ParserState = { elementIndex: 0 };
      const parseElement = jest.fn();

      const result = elementParsers.strong(data, state, parseElement);

      expect(result).toEqual({
        type: 'strong',
        text: 'Dragons are nice',
        style: undefined,
      });
      expect(state).toEqual({
        elementIndex: 1,
      });
    });
  });
});
