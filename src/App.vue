<template>
  <div id="app">
    <Timeline
      :start="{ hours: 8, minutes: 0 }"
      :end="{ hours: 22, minutes: 0 }"
      style="width: 100%; height: 500px;"
    >
      <TimelineRow name="dupa">
        <template v-for="(rect, index) in rects">
          <TimelineRowRect
            :key="index"
            :start="{ hours: rect[0], minutes: 0 }"
            :end="{ hours: rect[1], minutes: 0 }"
          />
        </template>
      </TimelineRow>
      <TimelineRow name="dupa2"></TimelineRow>
      <TimelineRow name="dupa sdsadasdas das dasdassd"></TimelineRow>
    </Timeline>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Timeline from "./components/Timeline.vue";
import TimelineRow from "./components/TimelineRow.vue";
import TimelineRowRect from "./components/TimelineRowRect.vue";

@Component({
  components: {
    Timeline,
    TimelineRow,
    TimelineRowRect
  }
})
export default class App extends Vue {
  private endHours: number = 12;

  private rects = [
    [8, 12],
    [13, 15],
    [16, 22]
  ];
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
