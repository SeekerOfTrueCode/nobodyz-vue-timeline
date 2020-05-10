import { VNodeDirective } from "vue";
declare type ResizeVNodeDirective = VNodeDirective;
declare function inserted(el: HTMLElement, binding: ResizeVNodeDirective): void;
declare function unbind(el: HTMLElement): void;
export declare const Resize: {
    inserted: typeof inserted;
    unbind: typeof unbind;
};
export default Resize;
