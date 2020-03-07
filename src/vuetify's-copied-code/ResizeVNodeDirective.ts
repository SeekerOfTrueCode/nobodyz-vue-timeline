import ResizeObserver from "resize-observer-polyfill";
import { VNodeDirective } from "vue";

interface HTMLElementResize extends HTMLElement {
    _resize: { observer: ResizeObserver };
}

interface ResizeVNodeDirective extends VNodeDirective {

}

function inserted(el: HTMLElement, binding: ResizeVNodeDirective) {
  const modifiers = binding.modifiers || /* istanbul ignore next */ {};
  const value = binding.value;
  const isObject = typeof value === "object";
  const callback = isObject ? value.handler : value;
  const { once, immediate, ...modifierKeys } = modifiers;
  // const hasModifiers = Object.keys(modifierKeys).length > 0;
  // const hasOptions = isObject && value.options;

  // Options take top priority
  // const options = hasOptions ? value.options : hasModifiers
  //   // If we have modifiers, use only those provided
  //   ? {

  //   }
  //   // Defaults to everything on
  //   : {

  //   };

  const observer = new ResizeObserver((
    mutationsList: ResizeObserverEntry[],
    observer: ResizeObserver
  ) => {
    /* istanbul ignore if */
    if (!(el as HTMLElementResize)._resize) return; // Just in case, should never fire

    callback(mutationsList, observer);

    // If has the once modifier, unbind
    once && unbind(el as HTMLElementResize);
  });

  observer.observe(el);
  (el as HTMLElementResize)._resize = { observer };

  if (immediate) {
    callback();
  }
}

function unbind(el: HTMLElement) {
  /* istanbul ignore if */
  if (!(el as HTMLElementResize)._resize) return;

  (el as HTMLElementResize)._resize.observer.disconnect();
  delete (el as HTMLElementResize)._resize;
}

export const Resize = {
  inserted,
  unbind
};

export default Resize;
