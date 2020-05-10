import { VNodeDirective } from "vue";
interface MutateVNodeDirective extends VNodeDirective {
    options?: MutationObserverInit;
}
declare function inserted(el: HTMLElement, binding: MutateVNodeDirective): void;
declare function unbind(el: HTMLElement): void;
export declare const Mutate: {
    inserted: typeof inserted;
    unbind: typeof unbind;
};
export default Mutate;
