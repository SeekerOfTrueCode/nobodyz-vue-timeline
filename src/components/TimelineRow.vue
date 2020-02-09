<template>
  <g>
    <!-- Background -->
    <rect
      :x="this.padding.left"
      :y="y + this.padding.top"
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
    <foreignObject
      :x="this.padding.left"
      :y="this.padding.top + y"
      :width="width / ticks"
      height="50"
    >
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

@Component
export default class TimelineRow extends Vue {
  @Prop({ default: "DefaultName", type: String })
  private name!: string;

  @InjectReactive("padding")
  private padding!: any;

  // private x: number = 0;
  private y: number = 0;

  private mounted() {
    if (this.$parent.$slots.default != null) {
      const index = this.$parent.$slots.default.indexOf(this.$vnode);
      // this.x = 0;
      this.y = this.height * index;
    }
  }

  public calcChildPosition(start: Time, end: Time) {
    return {
      x:
        this.padding.left +
        ((start.hours - this.rowStart.hours + 1) * this.widthPerTick +
          ((start.minutes - this.rowStart.minutes) / 60) * this.widthPerTick),
      y: this.padding.top + this.y + this.height / 4,
      width:
        (end.hours - start.hours) * this.widthPerTick +
        ((end.minutes - start.minutes) / 60) * this.widthPerTick,
      height: this.height / 2
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
    return (this.$parent as Timeline).width;
  }

  // private get padding(): any {
  //   return (this.$parent as Timeline).padding;
  // }

  private get ticks(): number {
    const ticks = (this.$parent as Timeline).ticks;
    return ticks != null ? ticks : 1;
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
