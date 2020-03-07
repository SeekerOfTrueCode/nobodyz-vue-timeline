<template>
  <div v-resize.immediate="observeUpdateSize" style="position: relative;">
    <svg :width="svg.width" :height="svg.height" style="background: rgba(0,0,0,.1);" tabindex="-1">
      <g v-if="width != 0 && height != 0">
        <g v-mutate.immediate.child="observeUpdateRowCount" type="rows">
          <slot />
        </g>
        <g type="border">
          <rect
            :x="padding.left"
            :y="padding.top"
            :width="width + titleWidthNumber"
            :height="height - timeStamps.size.height"
            stroke="#9a9a9a"
            stroke-width="1"
            fill-opacity="1"
            fill="none"
          />
        </g>
        <g type="elements" />
        <g type="timestamps" v-if="renderTimestamps">
          <text
            v-resize.immediate="observeUpdateTimestampsSize"
            :key="`hours-${time[0]}`"
            :x="Math.round(padding.left + titleWidthNumber - timeStamps.size.width/2)"
            :y="padding.top + height"
            class="small"
          >{{time[0].toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}}</text>
          <template v-for="(date,i) in time.slice(1)">
            <text
              :key="`hours-${date}`"
              :x="padding.left + titleWidthNumber + (widthPerTick * (i + 1)) - timeStamps.size.width/2"
              :y="padding.top + height"
              class="small"
            >{{date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}}</text>
          </template>
        </g>
      </g>
    </svg>
    <timeline-tooltip>
      <slot name="tooltip" />
    </timeline-tooltip>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Watch
} from "vue-property-decorator";
import { Time, Padding } from "@/components/Types";
import TimelineTooltip from "@/components/TimelineTooltip.vue";

import { Mutate } from "@/vuetify's-copied-code/MutateVNodeDirective";
import { Resize } from "@/vuetify's-copied-code/ResizeVNodeDirective";

interface Props {
  start: Time;
  end: Time;
  showTimestapms: boolean;
}

interface Svg {
  width: number;
  height: number;
}

function adjustPadding(value: string | number, relativeLength: number): number {
  if (value != null && value !== "" && !isNaN(Number(value.toString()))) {
    // is number
    return value as number;
  } else if (typeof value === "string" || (value as any) instanceof String) {
    const [char, char2] = ((value as string).substring(
      (value as string).length - 2
    )) as any;
    if (char2 === "%") {
      return (+(value as string).slice(0, -1) / 100) * relativeLength;
    }
    if (char2 === "x" && char === "p") {
      return +(value as string).slice(0, -2);
    }
  }
  return 0;
}

@Component({
  components: {
    TimelineTooltip
  },
  directives: {
    Mutate,
    Resize
  }
})
export default class Timeline extends Vue implements Props {
  @Prop({ required: true })
  public start!: Time;

  @Prop({ required: true })
  public end!: Time;

  @Prop({ default: true, required: false })
  public showTimestapms!: boolean;

  @Prop({ default: null, type: [Number, String] })
  public titleWidth!: string | number | null;

  @Prop({ default: 0, type: [Number, String] })
  public paddingLeft!: string | number;

  @Prop({ default: 0, type: [Number, String] })
  public paddingRight!: string | number;

  @Prop({ default: 0, type: [Number, String] })
  public paddingTop!: string | number;

  @Prop({ default: 0, type: [Number, String] })
  public paddingBottom!: string | number;

  // TODO: add handling the procentege as text
  // @ProvideReactive("itemPadding")
  public itemPadding: Padding = {
    top: 15,
    left: 5,
    right: 5,
    bottom: 15
  };

  private timeStamps = {
    size: {
      width: 0,
      height: 0
    }
  };

  private svg: Svg = {
    width: 0,
    height: 0
  };

  private timelineRowRectListeners = {};

  public width: number = 0;
  public height: number = 0;
  private rowCount: number = 0;

  // @ProvideReactive("titleWidthNumber")
  public titleWidthNumber: number = 0;

  // @ProvideReactive("padding")
  public padding: Padding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  private async mounted(): Promise<void> {
    await this.$nextTick();
    this.updatePaddingLeft();
    this.updatePaddingRight();
    this.updatePaddingTop();
    this.updatePaddingBottom();
  }

  @Watch("titleWidth")
  private updatetitleWidthNumber(value: string | number): void {
    if (this.titleWidth == null) {
      this.titleWidthNumber = this.width / this.ticks;
    } else {
      this.titleWidthNumber = adjustPadding(value, this.width);
    }
  }

  @Watch("paddingLeft")
  private updatePaddingLeft(): void {
    this.padding.left = adjustPadding(this.paddingLeft, this.width);
    this.updateSize(this.$el.clientWidth, this.$el.clientHeight);
    this.updateSvgSize();
  }

  @Watch("paddingRight")
  private updatePaddingRight(): void {
    this.padding.right = adjustPadding(this.paddingRight, this.width);
    this.updateSize(this.$el.clientWidth, this.$el.clientHeight);
    this.updateSvgSize();
  }

  @Watch("paddingTop")
  private updatePaddingTop(): void {
    this.padding.top = adjustPadding(this.paddingTop, this.height);
    this.updateSize(this.$el.clientWidth, this.$el.clientHeight);
    this.updateSvgSize();
  }

  @Watch("paddingBottom")
  private updatePaddingBottom(): void {
    this.padding.bottom = adjustPadding(this.paddingBottom, this.height);
    this.updateSize(this.$el.clientWidth, this.$el.clientHeight);
    this.updateSvgSize();
  }

  private observeUpdateRowCount(
    mutationsList?: MutationRecord[],
    observer?: MutationObserver
  ): void {
    this.rowCount = (this.$slots.default?.length ?? -1) + 1;
  }

  private updateTimeStampSize(width: number, height: number): void {
    this.timeStamps.size = {
      width,
      height
    };
  }

  private updateSize(width: number, height: number): void {
    if (width > 0 && height > 0) {
      const newWidthValue =
        width -
        this.titleWidthNumber -
        this.padding.left -
        this.padding.right -
        this.timeStamps.size.width / 2;
      // (this.renderTimestamps ? this.timeStamps.size.width / 2 + 5 : 0);
      const newHeightValue =
        height -
        this.padding.top -
        this.padding.bottom -
        this.timeStamps.size.height;
      // (this.renderTimestamps ? this.timeStamps.size.height : 0);
      if (this.width !== newWidthValue) {
        this.width = newWidthValue;
      }
      if (this.height !== newHeightValue) {
        this.height = newHeightValue;
      }
    }
  }

  private updateSvgSize() {
    this.svg = {
      width:
        this.width +
        this.titleWidthNumber +
        this.padding.left +
        this.padding.right +
        this.timeStamps.size.width / 2,
      height:
        this.height +
        this.padding.top +
        this.padding.bottom +
        this.timeStamps.size.height
    };
  }

  private observeUpdateSize(
    entries?: ResizeObserverEntry[],
    observer?: ResizeObserver
  ): void {
    this.padding.left = adjustPadding(this.paddingLeft, this.width);
    this.padding.right = adjustPadding(this.paddingRight, this.width);
    this.padding.top = adjustPadding(this.paddingTop, this.height);
    this.padding.bottom = adjustPadding(this.paddingBottom, this.height);

    this.updatetitleWidthNumber(this.titleWidth as any);
    if (entries && observer) {
      entries.forEach(({ contentRect: { width, height } }) => {
        this.updateSize(width, height);
      });
    } else {
      this.updateSize(this.$el.clientWidth, this.$el.clientHeight);
    }
    this.updateSvgSize();
  }

  private observeUpdateTimestampsSize(
    entries?: ResizeObserverEntry[],
    observer?: ResizeObserver
  ) {
    if (entries && observer) {
      entries.forEach(({ contentRect: { width, height } }) => {
        this.updateTimeStampSize(width, height);
        this.updateSize(this.$el.clientWidth, this.$el.clientHeight);
      });
    } else {
      const timestamps = this.$el.querySelector(`g[type="timestamps"] text`);
      const { width, height } = timestamps!.getBoundingClientRect();
      this.updateTimeStampSize(width, height);
      this.updateSize(this.$el.clientWidth, this.$el.clientHeight);
    }
    this.updateSvgSize();
    // console.log("observeUpdateTimestampsSize");
  }

  @Watch("showTimestapms")
  private onTimeStampChange(value: boolean): void {
    if (value) {
      const timestamps = this.$el.querySelector(`g[type="timestamps"] text`);
      const rect = timestamps?.getBoundingClientRect();
      this.updateTimeStampSize(rect?.width ?? 0, rect?.height ?? 0);
    } else {
      this.updateTimeStampSize(0, 0);
    }

    this.updateSize(this.$el.clientWidth, this.$el.clientHeight);
    this.updateSvgSize();
  }

  private get time(): Date[] {
    return Array.from(Array(this.ticks + 1), (d, i) => i).map(x => {
      return new Date(
        0,
        0,
        0,
        this.start.hours,
        this.start.minutes + x * this.hoursPerTick * 60,
        0
      );
    });
  }

  public get ticks(): number {
    const diffHours: number =
      ((this.end.hours as any) - (this.start.hours as any) + 1) * 60 +
      ((this.end.minutes as any) - (this.start.minutes as any));

    const ticks = {
      ammount: {
        min: 1,
        max: Math.ceil(diffHours / 60)
      },
      minWidthPx: 50
    };
    const estimatedTicksWidth = this.width / ticks.ammount.max;
    // console.trace(estimatedTicksWidth, ticks.minWidthPx);
    if (estimatedTicksWidth > ticks.minWidthPx) {
      return ticks.ammount.max;
    } else {
      const divider = Math.ceil(ticks.minWidthPx / estimatedTicksWidth);
      // console.log("divider", divider, ticks.ammount.max / divider);
      return Math.ceil(ticks.ammount.max / divider);
    }

    // return Math.ceil(22);
  }

  private get diffHours(): number {
    const diff: number =
      ((this.end.hours as any) - (this.start.hours as any) + 1) * 60 +
      ((this.end.minutes as any) - (this.start.minutes as any));
    return Math.ceil(diff / 60);
  }

  public get widthPerTick(): number {
    return this.width / this.ticks;
  }

  public get hoursPerTick(): number {
    return Math.round(this.diffHours / this.ticks);
  }

  public get heightPerRow(): number {
    return (this.height - this.timeStamps.size.height) / (this.rowCount - 1);
  }

  private get renderTimestamps(): boolean {
    return this.showTimestapms && this.time.length > 0;
  }
}
</script>

<style scoped lang="scss">
</style>
