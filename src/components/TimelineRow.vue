<template>
  <g>
    <!-- Background -->
    <rect
      :x="padding.left"
      :y="y + padding.top"
      :width="width"
      :height="height"
      stroke="none"
      stroke-width="0"
      fill="#ffffff"
    />
    <!-- Horizontal Line -->
    <path
      :d="horizontalPath(0, y + height, width)"
      stroke="#b7b7b7"
      stroke-width="1"
      fill-opacity="1"
      fill="none"
    ></path>
    <!-- Vertical Lines -->
    <template v-for="i in ticks">
      <path
        :d="verticalPath((width / ticks) * i, y, height)"
        :key="i"
        stroke-width="1"
        stroke="#e6e6e6"
        fill-opacity="1"
        fill="none"
      />
    </template>
    <foreignObject :x="padding.left" :y="padding.top + y" :width="widthPerTick" :height="height">
      <div>
        <span>{{ name }}</span>
      </div>
    </foreignObject>
    <slot />
  </g>
</template>

<script lang="ts">
import { Component, Prop, Vue, InjectReactive } from "vue-property-decorator";
import { Time } from "./Types";
import Timeline from "./Timeline.vue";

/**
 * Returns a number whose value is limited to the given range.
 *
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

@Component
export default class TimelineRow extends Vue {
  @Prop({ default: "DefaultName", type: String })
  private name!: string;

  @InjectReactive("padding")
  private padding!: any;

  @InjectReactive("itemPadding")
  private itemPadding!: any;

  // private x: number = 0;
  private get y(): number {
    return this.height * this.rowIndex;
  }

  private rowIndex: number = 0;

  private mounted() {
    this.updateIndex();
  }

  private updated() {
    this.updateIndex();
  }

  private updateIndex(): void {
    this.rowIndex = this.$parent.$slots.default?.indexOf(this.$vnode) ?? 0;
  }

  public calcChildPosition(start: Time, end: Time) {
    const startOfTheX = this.padding.left + this.itemPadding.left;
    const endOfTheX = this.itemPadding.left + this.itemPadding.right;

    const startOfTheY = this.padding.top + this.itemPadding.top + this.y;
    const endOfTheY = this.itemPadding.top + this.itemPadding.bottom;

    // don't allow element to go outisde of the timeline time borders
    if (this.rowStart.hours > start.hours) {
      start.hours = this.rowStart.hours;
      start.minutes = this.rowStart.minutes;
    }
    // if (this.rowEnd.hours < end.hours) {
    //   end.hours = this.rowEnd.hours;
    //   end.minutes = this.rowEnd.minutes;
    // }

    const startTick =
      (start.hours -
        this.rowStart.hours +
        (start.minutes - this.rowStart.minutes) / 60) /
      this.hoursPerTick;
    const endTick =
      (end.hours - start.hours + (end.minutes - start.minutes) / 60) /
      this.hoursPerTick;
    const maxWidth = (this.ticks - startTick - 1) * this.widthPerTick - endOfTheX;
    const newPos = {
      x: startOfTheX + (startTick + 1) * this.widthPerTick,
      y: startOfTheY,
      width: clamp(endTick * this.widthPerTick - endOfTheX, 0, maxWidth),
      height: this.height - endOfTheY
    };

    // // dont't allow width to go outside of the timeline
    // newPos.width = clamp(
    //   newPos.width,
    //   0,
    //   this.padding.left - this.itemPadding.left + this.width - newPos.x
    // );
    return newPos;
  }

  private verticalPath(x: number, y: number, height: number): string {
    return `M${this.padding.left + x},${this.padding.top + y}L${this.padding
      .left + x},${this.padding.top + y + height}`;
  }

  private horizontalPath(x: number, y: number, width: number): string {
    return `M${this.padding.left + x},${this.padding.top + y}L${this.padding
      .left + width},${this.padding.top + y}`;
  }

  private get width(): number {
    return (this.$parent as any).width;
  }

  // private get padding(): any {
  //   return (this.$parent as Timeline).padding;
  // }

  private get ticks(): number {
    const ticks = (this.$parent as Timeline).ticks;
    return ticks != null ? ticks : 1;
  }

  private get hoursPerTick(): number {
    return (this.$parent as Timeline).hoursPerTick;
  }

  private get widthPerTick(): number {
    return (this.$parent as Timeline).widthPerTick;
  }

  private get height(): number {
    return (this.$parent as Timeline).heightPerRow;
  }

  private get rowStart(): Time {
    return (this.$parent as Timeline).start;
  }

  private get rowEnd(): Time {
    return (this.$parent as Timeline).end;
  }
}
</script>

<style scoped lang="scss">
foreignObject {
  > div {
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
