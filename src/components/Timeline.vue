<template>
  <div>
    <svg :width="svgWidth" :height="svgHeight" style="background: rgba(0,0,0,.1);" tabindex="-1">
      <g v-if="width != 0 && height != 0">
        <!-- Pierwsza linia -->
        <slot />
        <!-- Obramowanie całego Timline'a -->
        <rect
          :x="padding.left"
          :y="padding.top"
          :width="width"
          :height="height - timeStamps.offSet"
          stroke="#9a9a9a"
          stroke-width="1"
          fill-opacity="1"
          fill="none"
        />
        <g type="elements" />
        <template v-for="(date,i) in time">
          <text
            :x="padding.left + (width/ticks * (i + 1)) - width/38"
            :y="padding.top + height - 35"
            class="small"
            :key="`hours-${date}`"
          >{{date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}}</text>
        </template>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, ProvideReactive } from "vue-property-decorator";
import TimelineRow from "./TimelineRow.vue";
import { Time } from "./Types";

@Component({
  components: {
    row: TimelineRow
  }
})
export default class Timeline extends Vue {
  @ProvideReactive("start")
  @Prop({ required: true })
  public start!: Time;

  @ProvideReactive("end")
  @Prop({ required: true })
  public end!: Time;

  @ProvideReactive("padding")
  public padding = {
    top: 50,
    left: 50,
    right: 50,
    bottom: 10
  };

  private timeStamps = {
    offSet: 50
  };

  public width: number = 0;
  public height: number = 0;
  private rowCount: number = 0;

  private mounted() {
    this.width = this.$el.scrollWidth - this.padding.left - this.padding.right;
    this.height =
      this.$el.scrollHeight - this.padding.top - this.padding.bottom;
    if (this.$slots.default != null) {
      this.rowCount = this.$slots.default.length + 1;
    }
  }

  private get time(): Date[] {
    return Array.from(Array(this.ticks), (d, i) => i).map(x => {
      return new Date(0, 0, 0, this.start.hours + x, this.start.minutes, 0);
    });
  }

  public get ticks(): number {
    const diffHours: number =
      (this.end.hours as any) -
      (this.start.hours as any) +
      ((this.end.minutes / 60) as any) -
      ((this.start.minutes / 60) as any);
    const deltaHours = Math.ceil(diffHours);
    return deltaHours + 1;
  }

  public get widthPerTick(): number {
    return this.width / this.ticks;
  }

  public get heightPerRow(): number {
    return (this.height - this.timeStamps.offSet) / (this.rowCount - 1);
  }

  private get svgWidth(): number {
    return this.width + this.padding.left + this.padding.right;
  }

  private get svgHeight(): number {
    return this.height + this.padding.top + this.padding.bottom;
  }
}
</script>

<style scoped lang="scss">
</style>
