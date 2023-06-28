export const createOrEditStyleTag = (id: string, css: string): (() => void) | undefined => {
  const [head] = document.getElementsByTagName('head');

  if (!head) {
    return;
  }

  const tagById = document.getElementById(id);

  if (tagById) {
    tagById.innerHTML = css;
    return () => tagById.remove();
  }

  const style = document.createElement('style');
  style.id = id;
  style.innerHTML = css;

  head.appendChild(style);

  return () => style.remove();
}
