import jsdom from 'jsdom';

import { parseDescription } from './parseDescription';

describe('parseDescription', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a default node when the body element could not be found from the parsed HTML', () => {
    jest
      .spyOn(jsdom, 'JSDOM')
      .mockReturnValue({
        window: {
          document: {
            querySelector: () => {},
          },
        },
      } as any);

    const description = 'some HTML';

    const result = parseDescription(description);

    expect(result).toEqual({
      type: 'root',
      text: '',
      children: [],
    });
    expect(jsdom.JSDOM).toBeCalledTimes(1);
    expect(jsdom.JSDOM).toBeCalledWith(`<!DOCTYPE html>${description}`);
  });

  it('should return an empty tree when the body element is empty', () => {
    const bodyElement = {
      attributes: {
        getNamedItem: () => {},
      },
    };

    jest
      .spyOn(jsdom, 'JSDOM')
      .mockReturnValue({
        window: {
          document: {
            querySelector: () => {
              return bodyElement;
            },
          },
        },
      } as any);

    const description = 'some HTML';

    const result = parseDescription(description);

    expect(result).toEqual({
      type: 'root',
      text: '',
      textAlign: 'left',
      children: [],
    });
    expect(jsdom.JSDOM).toBeCalledTimes(1);
    expect(jsdom.JSDOM).toBeCalledWith(`<!DOCTYPE html>${description}`);
  });

  it('should return a description tree when the body element is not empty', () => {
    const divAttributes = new Set([
      { name: 'class', value: 'bbcode-center' },
      { name: 'style', value: 'color: #f00' },
    ]);
    (divAttributes as any).getNamedItem = () => { };

    const bodyElement = {
      attributes: {
        getNamedItem: () => {},
      },
      textContent: 'Dragons are nice - 1',
      childNodes: new Set([
        { nodeName: '#TEXT', textContent: '\nDragons are nice - 2' },
        {
          nodeName: 'SPAN',
          textContent: null,
          childNodes: new Set([
            {
              nodeName: 'STRONG',
              textContent: 'Dragons are nice - 3',
              childNodes: new Set(),
            },
          ]),
          children: new Set([
            {
              nodeName: 'STRONG',
              textContent: 'Dragons are nice - 3',
              attributes: { getNamedItem: () => {} },
              childNodes: new Set(),
            },
          ]),
        },
        { nodeName: 'DIV', textContent: 'Dragons are nice - 4', attributes: divAttributes },
      ]),
      children: new Set([
        {
          nodeName: 'SPAN',
          textContent: null,
          attributes: { getNamedItem: () => {} },
          childNodes: new Set([
            {
              nodeName: 'STRONG',
              textContent: 'Dragons are nice - 3',
              childNodes: new Set(),
            },
          ]),
          children: new Set([
            {
              nodeName: 'STRONG',
              textContent: 'Dragons are nice - 3',
              attributes: { getNamedItem: () => { } },
              childNodes: new Set(),
            },
          ]),
        },
        { nodeName: 'DIV', textContent: 'Dragons are nice - 4', attributes: divAttributes },
      ]),
    };

    jest
      .spyOn(jsdom, 'JSDOM')
      .mockReturnValue({
        window: {
          document: {
            querySelector: () => {
              return bodyElement;
            },
          },
        },
      } as any);

    const description = 'some HTML';

    const result = parseDescription(description);

    expect(result).toEqual({
      type: 'root',
      text: 'Dragons are nice - 1',
      textAlign: 'left',
      children: [
        {
          type: 'text',
          text: 'Dragons are nice - 2',
        },
        {
          type: 'span',
          text: '',
          style: undefined,
          children: [
            {
              type: 'strong',
              text: 'Dragons are nice - 3',
              style: undefined,
            },
          ],
        },
        {
          type: 'unknown',
          tagName: 'div',
          text: 'Dragons are nice - 4',
          textAlign: 'left',
          attributes: {
            class: 'bbcode-center',
            style: 'color: #f00',
          },
          children: [],
        },
      ],
    });
    expect(jsdom.JSDOM).toBeCalledTimes(1);
    expect(jsdom.JSDOM).toBeCalledWith(`<!DOCTYPE html>${description}`);
  });

  it('should remove the first child element when it has no text', () => {
    const bodyElement = {
      attributes: {
        getNamedItem: () => {},
      },
      textContent: 'Dragons are nice - 1',
      childNodes: new Set([
        { nodeName: '#TEXT', textContent: '' },
        {
          nodeName: 'SPAN',
          textContent: null,
          childNodes: new Set([
            {
              nodeName: 'STRONG',
              textContent: 'Dragons are nice - 3',
              childNodes: new Set(),
            },
          ]),
          children: new Set([
            {
              nodeName: 'STRONG',
              textContent: 'Dragons are nice - 3',
              attributes: { getNamedItem: () => {} },
              childNodes: new Set(),
            },
          ]),
        },
      ]),
      children: new Set([
        {
          nodeName: 'SPAN',
          textContent: null,
          attributes: { getNamedItem: () => {} },
          childNodes: new Set([
            {
              nodeName: 'STRONG',
              textContent: 'Dragons are nice - 3',
              childNodes: new Set(),
            },
          ]),
          children: new Set([
            {
              nodeName: 'STRONG',
              textContent: 'Dragons are nice - 3',
              attributes: { getNamedItem: () => { } },
              childNodes: new Set(),
            },
          ]),
        },
      ]),
    };

    jest
      .spyOn(jsdom, 'JSDOM')
      .mockReturnValue({
        window: {
          document: {
            querySelector: () => {
              return bodyElement;
            },
          },
        },
      } as any);

    const description = 'some HTML';

    const result = parseDescription(description);

    expect(result).toEqual({
      type: 'root',
      text: 'Dragons are nice - 1',
      textAlign: 'left',
      children: [
        {
          type: 'span',
          text: '',
          style: undefined,
          children: [
            {
              type: 'strong',
              text: 'Dragons are nice - 3',
              style: undefined,
            },
          ],
        },
      ],
    });
    expect(jsdom.JSDOM).toBeCalledTimes(1);
    expect(jsdom.JSDOM).toBeCalledWith(`<!DOCTYPE html>${description}`);
  });

  it('should return an empty tree when the body has no childNodes nor children', () => {
    const bodyElement = {
      attributes: {
        getNamedItem: () => {},
      },
      textContent: 'Dragons are nice - 1',
    };

    jest
      .spyOn(jsdom, 'JSDOM')
      .mockReturnValue({
        window: {
          document: {
            querySelector: () => {
              return bodyElement;
            },
          },
        },
      } as any);

    const description = 'some HTML';

    const result = parseDescription(description);

    expect(result).toEqual({
      type: 'root',
      text: 'Dragons are nice - 1',
      textAlign: 'left',
      children: [],
    });
    expect(jsdom.JSDOM).toBeCalledTimes(1);
    expect(jsdom.JSDOM).toBeCalledWith(`<!DOCTYPE html>${description}`);
  });
});
