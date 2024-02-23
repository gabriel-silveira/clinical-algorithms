export function autoResizeTextarea(textarea: HTMLTextAreaElement) {
  const resize = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    if (textarea.scrollHeight === 42) {
      textarea.style.marginTop = '-24px';
    } else if (textarea.scrollHeight === 63) {
      textarea.style.marginTop = '-34px';
    } else {
      textarea.style.marginTop = '-15px';
    }
  };

  /* 0-timeout to get the already changed text */
  const delayedResize = () => {
    window.setTimeout(resize, 0);
  };

  const observeTextarea = (
    element: HTMLElement,
    // eslint-disable-next-line no-undef
    event: keyof HTMLElementEventMap,
    handler: any,
  ) => {
    if (element) {
      element.addEventListener(event, handler, false);
    }
  };

  observeTextarea(textarea, 'change', resize);
  observeTextarea(textarea, 'cut', delayedResize);
  observeTextarea(textarea, 'paste', delayedResize);
  observeTextarea(textarea, 'drop', delayedResize);
  observeTextarea(textarea, 'keydown', delayedResize);

  textarea.focus();
  textarea.select();
  resize();
}
