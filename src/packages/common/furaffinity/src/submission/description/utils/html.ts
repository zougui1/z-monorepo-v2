import { stripHtml } from 'string-strip-html';
import { JSDOM, DOMWindow } from 'jsdom';

export const parseSafeHTML = (html: string): ParsedHTML => {
  const safeHtml = stripHtml(html, {
    onlyStripTags: ['script', 'style', 'xml'],
    stripTogetherWithTheirContents: ['script', 'style', 'xml'],
  });
  const { window } = new JSDOM(`<!DOCTYPE html>${safeHtml.result}`);
  const { document } = window;

  return { window, document };
}

export interface ParsedHTML {
  window: DOMWindow;
  document: Document;
}
