import { VNodeDirective } from "vue";

interface HTMLElementMutate extends HTMLElement {
  _mutate: { observer: MutationObserver };
}

interface MutateVNodeDirective extends VNodeDirective {
  options?: MutationObserverInit;
}

function inserted(el: HTMLElement, binding: MutateVNodeDirective) {
  const modifiers = binding.modifiers || /* istanbul ignore next */ {};
  const value = binding.value;
  const isObject = typeof value === "object";
  const callback = isObject ? value.handler : value;
  const { once, immediate, ...modifierKeys } = modifiers;
  const hasModifiers = Object.keys(modifierKeys).length > 0;
  const hasOptions = isObject && value.options;

  // Options take top priority
  const options = hasOptions
    ? value.options
    : hasModifiers
    ? // If we have modifiers, use only those provided
      {
        attributes: modifierKeys.attr,
        childList: modifierKeys.child,
        subtree: modifierKeys.sub,
        characterData: modifierKeys.char
      }
    : // Defaults to everything on
      {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      };

  const observer = new MutationObserver(
    (mutationsList: MutationRecord[], observer: MutationObserver) => {
      /* istanbul ignore if */
      if (!(el as HTMLElementMutate)._mutate) return; // Just in case, should never fire

      callback(mutationsList, observer);

      // If has the once modifier, unbind
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      once && unbind(el as HTMLElementMutate);
    }
  );

  observer.observe(el, options);
  (el as HTMLElementMutate)._mutate = { observer };

  if (immediate) {
    callback();
  }
}

function unbind(el: HTMLElement) {
  /* istanbul ignore if */
  if (!(el as HTMLElementMutate)._mutate) return;

  (el as HTMLElementMutate)._mutate.observer.disconnect();
  delete (el as HTMLElementMutate)._mutate;
}

export const Mutate = {
  inserted,
  unbind
};

export default Mutate;
