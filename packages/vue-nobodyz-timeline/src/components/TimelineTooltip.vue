<template>
  <div
    ref="tooltip-ref"
    :style="{ ...tooltipPositionStyle, 'pointer-events': 'none' }"
  >
    <div v-show="relativePos.x && relativePos.y" v-resize="calcPos">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Ref } from "vue-property-decorator";
import { Resize } from "@/vuetify's-copied-code/ResizeVNodeDirective";
import { VNode } from "vue";

export type Tooltip = {
  x: number;
  y: number;
  target: EventTarget | null;
} | null;

function calculateRelativePos(parent: HTMLElement, target: HTMLElement) {
  const parentRect = parent.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  return {
    x: targetRect.x - parentRect.x,
    y: targetRect.y - parentRect.y
  };
}

@Component({
  directives: {
    Resize
  }
})
export default class TimelineTooltip extends Vue {
  @Ref("tooltip-ref")
  private tooltipRef!: HTMLElement;

  private tooltip: Tooltip = null;

  private contentSize = {
    width: 0,
    height: 0
  };

  private created() {
    (this
      .$parent as any).timelineRowRectListeners.mouseenter = this.showTooltip;
    (this
      .$parent as any).timelineRowRectListeners.mouseleave = this.hideTooltip;
  }

  private destroyed() {
    (this.$parent as any).timelineRowRectListeners.mouseenter = null;
    (this.$parent as any).timelineRowRectListeners.mouseleave = null;
  }

  protected showTooltip(event: MouseEvent): void {
    this.tooltip = {
      x: event.x,
      y: event.y,
      target: event.target
    };
  }

  protected hideTooltip(event: MouseEvent): void {
    this.tooltip = null;
  }

  private get relativePos() {
    if (this.tooltip) {
      return calculateRelativePos(
        this.tooltipRef,
        this.tooltip?.target as HTMLElement
      );
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  }

  private get tooltipPositionStyle() {
    if (this.relativePos.x && this.relativePos.y) {
      const targetRect = (this.tooltip
        ?.target as HTMLElement).getBoundingClientRect();
      const rectCenter = {
        x: this.relativePos.x + targetRect.width / 2,
        y: this.relativePos.y + targetRect.height / 2
      };
      // TODO: Add function as property to decide position calculation alghoritm
      return {
        left: `${Math.round(rectCenter.x - this.contentSize.width / 2)}px`,
        top: `${Math.round(rectCenter.y - this.contentSize.height / 2)}px`,
        position: `absolute`
      };
    } else {
      return {
        left: `0px`,
        top: `0px`,
        position: `absolute`
      };
    }
  }

  private calcPos(entries: ResizeObserverEntry[]) {
    entries?.forEach(({ contentRect: { width, height } }) => {
      this.contentSize = {
        width,
        height
      };
    });
  }
}
</script>
