import { createDecorator } from "vue-class-component";

interface Options {
  name: string;
}
interface Props {
  _registeredWrapMountedArray: string[] | undefined;
}
export function WrapMounted(decoratorOptions?: Options) {
  return createDecorator((options, key: string) => {
    // component options should be passed to the callback
    // and update for the options object affect the component
    if ((options as any)._registeredWrapMountedArray == null) {
      (options as any)._registeredWrapMountedArray = [];
    }
    if (decoratorOptions?.name && !((options as any)._registeredWrapMountedArray as any[])?.includes(decoratorOptions.name)) {
      ((options as any)._registeredWrapMountedArray as any[]).push(decoratorOptions.name);
    }

    if (!(options as any)._registeredWrapMounted) {
      const originalMounted = options.mounted;
      options.mounted = function mounted(...args) {
        originalMounted?.apply(this, args);
        ((options as any)._registeredWrapMountedArray as any[]).forEach(k => {
          console.log(`Invoked: ${k}(`, ...args, ")");
        });
      };
      (options as any)._registeredWrapMounted = true;
    }
  });
}
