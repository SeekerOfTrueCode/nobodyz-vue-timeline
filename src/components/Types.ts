export interface Period {
    start: Time;
    end: Time;
}
export interface Time {
    hours: number;
    minutes: number;
}

export type Padding = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
