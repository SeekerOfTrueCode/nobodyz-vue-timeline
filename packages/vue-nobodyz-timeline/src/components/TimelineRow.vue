<template>
  <g>
    <!-- Background -->
    <rect
      :x="padding.left"
      :y="y + padding.top"
      :width="width + titleWidthNumber"
      :height="Math.abs(height)"
      stroke="none"
      stroke-width="0"
      fill="#ffffff"
    />
    <!-- Horizontal Line -->
    <path
      :d="horizontalPath(0, y + height, width + titleWidthNumber)"
      stroke="#b7b7b7"
      stroke-width="1"
      fill-opacity="1"
      fill="none"
    ></path>
    <!-- Vertical Lines -->
    <template v-for="i in ticks">
      <path
        :d="
          verticalPath(titleWidthNumber + (width / ticks) * (i - 1), y, height)
        "
        :key="i"
        stroke-width="1"
        stroke="#e6e6e6"
        fill-opacity="1"
        fill="none"
      />
    </template>
    <foreignObject
      :x="padding.left"
      :y="padding.top + y"
      :width="titleWidthNumber"
      :height="Math.abs(height)"
    >
      <div>
        <span>{{ name }}</span>
      </div>
    </foreignObject>
    <slot></slot>
  </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Time, Padding } from "./Types";
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

@Component<TimelineRow>({})
export default class TimelineRow extends Vue {
  public $parent!: Timeline;

  @Prop({ default: "DefaultName", type: String })
  private name!: string;

  // private x: number = 0;
  private get y(): number {
    return this.height * this.rowIndex;
  }

  private rowIndex = 0;

  private async mounted() {
    await this.$nextTick();
    this.updateIndex();
    console.log("[Parent]", this.$parent);
  }

  private updated() {
    this.updateIndex();
  }

  private updateIndex(): void {
    console.log("[TimelineRow] updateIndex", this);
    const parentsChildren = this.$parent?.$children.filter(x => x instanceof TimelineRow);
    this.rowIndex = parentsChildren.indexOf(this);
    // const slotsArray = this.$parent?.$slots?.default ?? (this.$parent?.$scopedSlots as any)().default;
    // this.rowIndex = slotsArray.indexOf(this.$vnode) ?? 0;
  }

  public get calcChildPosition(): any {
    const startOfTheX =
      this.padding.left + this.titleWidthNumber + this.itemPadding.left;
    const endOfTheX = this.itemPadding.left + this.itemPadding.right;

    const startOfTheY = this.padding.top + this.itemPadding.top + this.y;
    const endOfTheY = this.itemPadding.top + this.itemPadding.bottom;

    return (start: Time, end: Time): any => {
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
      const maxWidth = (this.ticks - startTick) * this.widthPerTick - endOfTheX;
      const newPos = {
        x: startOfTheX + startTick * this.widthPerTick,
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
    };
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
    return this.$parent.width;
  }

  private get padding(): Padding {
    return this.$parent.padding;
  }

  private get itemPadding(): Padding {
    return this.$parent.itemPadding;
  }

  private get titleWidthNumber(): number {
    return this.$parent.titleWidthNumber;
  }

  // @InjectReactive("padding")
  // private padding!: any;

  // @InjectReactive("itemPadding")
  // private itemPadding!: any;

  // @InjectReactive("titleWidthNumber")
  // private titleWidthNumber!: number;

  private get ticks(): number {
    const ticks = this.$parent.ticks;
    return ticks != null ? ticks : 1;
  }

  private get hoursPerTick(): number {
    return this.$parent.hoursPerTick;
  }

  private get widthPerTick(): number {
    return this.$parent.widthPerTick;
  }

  private get height(): number {
    return this.$parent.heightPerRow;
  }

  private get rowStart(): Time {
    return this.$parent.start;
  }

  private get rowEnd(): Time {
    return this.$parent.end;
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
