<template>
  <div id="app">
    <Timeline
      :start="{ hours: 8, minutes: 0 }"
      :end="{ hours: 22, minutes: 0 }"
      :show-timestapms="showTimestamps"
      :title-width="100"
      padding-left="5%"
      padding-right="5%"
      style="width: 100%; height: 500px;"
    >
      <TimelineRow name="dupa">
          <TimelineRowRects
            :items="rects"
            @click="onClick"
          />
      </TimelineRow>
      <TimelineRow name="dupa2"></TimelineRow>
      <template v-for="(i) of (endHours - 10)">
        <TimelineRow :key="`timelines-${i}`" name="dupa sdsadasdas das dasdassd"></TimelineRow>
      </template>
      <template v-slot:tooltip>
        <div style="background-color: rgba(255,255,255,.4); border: 1px solid black; width: 200px; height: 50px;">
          hehehee
        </div>
      </template>
    </Timeline>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Timeline from "./components/Timeline.vue";
import TimelineRow from "./components/TimelineRow.vue";
import TimelineRowRects from "./components/TimelineRowRects.vue";

@Component({
  components: {
    Timeline,
    TimelineRow,
    TimelineRowRects
  }
})
export default class App extends Vue {
  private endHours: number = 12;
  private showTimestamps: boolean = true;

  private rects = [
    {
      start: {
        hours: 6,
        minutes: 0
      },
      end: {
        hours: 12,
        minutes: 0
      },
      data: "#1"
    },
    {
      start: {
        hours: 13,
        minutes: 0
      },
      end: {
        hours: 15,
        minutes: 0
      },
      data: "#2"
    },
    {
      start: {
        hours: 16,
        minutes: 0
      },
      end: {
        hours: 21,
        minutes: 0
      },
      data: "#3"
    }
  ];

  private onClick(item: any) {
    console.log("click", item);
  }
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
