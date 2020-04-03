<template>
  <g>
    <template v-for="({ key: item, value: pos }, index) in rects">
      <rect
        :key="`rect-${index}`"
        :x="pos.x"
        :y="pos.y"
        :width="pos.width"
        :height="Math.abs(pos.height)"
        stroke="none"
        stroke-width="0"
        :fill="
          !colidedItems.includes(item)
            ? 'rgb(66, 133, 244, .8)'
            : 'rgb(255, 0, 0, .8)'
        "
        v-on="on"
        @click="click(item)"
      />
    </template>
  </g>

  <!--
    @mouseenter="$parent.$parent.showTooltip"
    @mouseleave="$parent.$parent.hideTooltip"
  -->
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// import TimelineRow from "./TimelineRow.vue";
import { Time, Period, RectDimensions } from "./Types";
import TimelineRow from "./TimelineRow.vue";

function dateRangeOverlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
) {
  if (aStart < bStart && bStart < aEnd) return true; // b starts in a
  if (aStart < bEnd && bEnd < aEnd) return true; // b ends in a
  if (bStart < aStart && aEnd < bEnd) return true; // a in b
  return false;
}

@Component<TimelineRowRects>({})
export default class TimelineRowRects extends Vue {
  public $parent!: TimelineRow;

  @Prop({ required: true })
  private items!: Period[];

  private rects: { key: Period; value: RectDimensions }[] = [];
  private colidedItems: Period[] = [];

  @Watch("items", { deep: true, immediate: true })
  @Watch("$parent.calcChildPosition")
  private async calculate() {
    await this.$nextTick();
    // console.log("called");
    this.rects = [];
    this.colidedItems = [];
    this.items.forEach(item => {
      // calculate rect positions
      this.rects.push({
        key: item,
        value: this.$parent.calcChildPosition(item.start, item.end)
      });
      // calculate collisions
      if (
        this.items.some(b =>
          dateRangeOverlaps(
            item.start.hours * 60 + item.start.minutes,
            item.end.hours * 60 + item.end.minutes,
            b.start.hours * 60 + b.start.minutes,
            b.end.hours * 60 + b.end.minutes
          )
        )
      ) {
        this.colidedItems.push(item);
      }
    });

    // this.colidedItems = this.items.filter(item => {
    //   return this.items.some(b =>
    //     dateRangeOverlaps(
    //       item.start.hours * 60 + item.start.minutes,
    //       item.end.hours * 60 + item.end.minutes,
    //       b.start.hours * 60 + b.start.minutes,
    //       b.end.hours * 60 + b.end.minutes
    //     )
    //   );
    // });
    this.$emit("collisions", [...this.colidedItems]);
  }

  private mounted() {
    this.$nextTick(() => {
      const g = this.$parent.$parent.$el.querySelector(`g[type="elements"]`);
      g?.appendChild(this.$el);
    });
  }

  private destroyed() {
    const g = this.$parent.$parent.$el.querySelector(`g[type="elements"]`);
    g?.removeChild(this.$el);
  }

  private get on() {
    return {
      ...this.$parent.$parent.timelineRowRectListeners
    };
  }

  private click(item: any): void {
    this.$emit("click", item);
  }
}
</script>
