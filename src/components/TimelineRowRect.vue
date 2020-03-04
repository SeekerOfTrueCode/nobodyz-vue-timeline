<template>
  <rect
    :x="position.x"
    :y="position.y"
    :width="position.width"
    :height="Math.abs(position.height)"
    stroke="none"
    stroke-width="0"
    fill="rgb(66, 133, 244, .8)"
    v-on="on"
  />
  <!--
    @mouseenter="$parent.$parent.showTooltip"
    @mouseleave="$parent.$parent.hideTooltip"
  -->
</template>

<script lang="ts">
import { Component, Prop, Vue, InjectReactive } from "vue-property-decorator";
import { Time } from "./Types";
import TimelineRow from "./TimelineRow.vue";

@Component
export default class TimelineRowRect extends Vue {
  @Prop({ required: true })
  private start!: Time;

  @Prop({ required: true })
  private end!: Time;
  // @Prop({ default: "DefaultName", type: String })
  // private name!: string;

  private get position() {
    return (this.$parent as TimelineRow).calcChildPosition(
      this.start,
      this.end
    );
  }

  private mounted() {
    const g = this.$parent.$parent.$el.querySelector(`g[type="elements"]`);
    g?.appendChild(this.$el);
  }

  private destroyed() {
    const g = this.$parent.$parent.$el.querySelector(`g[type="elements"]`);
    g?.removeChild(this.$el);
  }

  private get on() {
    return {
      ...this.$listeners,
      ...(this.$parent as any).$parent.timelineRowRectListeners
    };
  }
}
</script>
