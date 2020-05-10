export interface Period {
    start: Time;
    end: Time;
}
export interface Time {
    hours: number;
    minutes: number;
}
export declare type Padding = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export interface RectDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
}
