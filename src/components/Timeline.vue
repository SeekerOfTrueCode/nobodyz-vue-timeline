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
            :width="width"
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
            :x="padding.left + widthPerTick - timeStamps.size.width/2"
            :y="padding.top + height"
            class="small"
          >
            {{time[0].toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}}
          </text>
          <template v-for="(date,i) in time.slice(1)">
            <text
              :key="`hours-${date}`"
              :x="padding.left + widthPerTick + (widthPerTick * (i + 1)) - timeStamps.size.width/2"
              :y="padding.top + height"
              class="small"
            >
              {{date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}}
            </text>
          </template>
        </g>
      </g>
    </svg>
    <timeline-tooltip>
      <slot name="tooltip"/>
    </timeline-tooltip>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  ProvideReactive,
  Watch
} from "vue-property-decorator";
import { Time } from "@/components/Types";
import TimelineTooltip from "@/components/TimelineTooltip.vue";

import { Mutate } from "@/vuetify's-copied-code/MutateVNodeDirective";
import { Resize } from "@/vuetify's-copied-code/ResizeVNodeDirective";

interface Props {
  start: Time;
  end: Time;
  showTimestapms: boolean;
}

export type Padding = {
  top: number,
  right: number,
  bottom: number,
  left: number
};

interface Svg {
  width: number;
  height: number;
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
  @ProvideReactive("start")
  @Prop({ required: true })
  public start!: Time;

  @ProvideReactive("end")
  @Prop({ required: true })
  public end!: Time;

  @Prop({ default: true, required: false })
  public showTimestapms!: boolean;

  @ProvideReactive("padding")
  public padding: Padding = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

  // TODO: add handling the procentege as text
  @ProvideReactive("itemPadding")
  public itemPadding = {
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

  private timelineRowRectListeners = {

  };

  public width: number = 0;
  public height: number = 0;
  private rowCount: number = 0;

  private created() {
    console.log("created");
    this.$nextTick().then(() => {
      // padding update (needs to listen to style changes)
      // const getPadding = (value: string) => parseInt(window.getComputedStyle(this.$el, null).getPropertyValue(value).slice(0, 3));
      const paddings = window.getComputedStyle(this.$el, null).getPropertyValue("padding").split("px").map(x => parseInt(x.trim()));
      paddings.pop();
      if (paddings.some(x => x)) {
        this.padding = {
          top: paddings[0],
          right: paddings[1],
          bottom: paddings[2],
          left: paddings[3]
        };
        console.log("clear style");
        (this.$el as HTMLElement).style.padding = "";
      }
    });
  }

  private observeUpdateRowCount(mutationsList?: MutationRecord[], observer?: MutationObserver): void {
    this.rowCount = (this.$slots.default?.length ?? -1) + 1;
  }

  private updateTimeStampSize(width: number, height: number): void {
    this.timeStamps.size = {
      width,
      height
    };
  }

  private updateSize(width: number, height: number): void {
    // console.log(width, height);
    if (width > 0 && height > 0) {
      this.width =
        width -
        this.padding.left -
        this.padding.right -
        this.timeStamps.size.width / 2;
      // (this.renderTimestamps ? this.timeStamps.size.width / 2 + 5 : 0);
      this.height =
        height -
        this.padding.top -
        this.padding.bottom -
        this.timeStamps.size.height;
      // (this.renderTimestamps ? this.timeStamps.size.height : 0);
    }
  }

  private observeUpdateSize(entries?: ResizeObserverEntry[], observer?: ResizeObserver): void {
    if (entries && observer) {
      entries.forEach(({ contentRect: { width, height } }) => {
        this.updateSize(width, height);
      });
    } else {
      this.updateSize(this.$el.clientWidth, this.$el.clientHeight);
    }
  }

  private observeUpdateTimestampsSize(entries?: ResizeObserverEntry[], observer?: ResizeObserver) {
    if (entries && observer) {
      entries.forEach(({ contentRect: { width, height } }) => {
        this.updateTimeStampSize(width, height);
      });
    } else {
      const timestamps = this.$el.querySelector(
        `g[type="timestamps"] text`
      );
      const { width, height } = timestamps!.getBoundingClientRect();
      this.updateTimeStampSize(width, height);
    }
  }

  @Watch("showTimestapms")
  private onTimeStampChange(): void {
    this.$nextTick(() =>
      this.updateSize(this.$el.clientWidth, this.$el.clientHeight)
    );
  }

  private get time(): Date[] {
    return Array.from(Array(this.ticks), (d, i) => i).map(x => {
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
    console.log(estimatedTicksWidth, ticks.minWidthPx);
    if (estimatedTicksWidth > ticks.minWidthPx) {
      return ticks.ammount.max;
    } else {
      const divider = Math.ceil(ticks.minWidthPx / estimatedTicksWidth);
      console.log("divider", divider, ticks.ammount.max / divider);
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

  private get svg(): Svg {
    // console.log(this.timeStamps.size.height);
    return {
      width:
        this.width +
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

  private get renderTimestamps(): boolean {
    return this.showTimestapms && this.time.length > 0;
  }
}
</script>

<style scoped lang="scss">
</style>
