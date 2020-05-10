<template>
  <div>
    <Timeline
      :start="period.start"
      :end="period.end"
      :show-timestapms="showTimestamps"
      :title-width="100"
      padding-left="5%"
      padding-right="5%"
      style="width: 100%; height: 200px;"
    >
      <TimelineRow name="Title">
        <TimelineRowRects
          :items="rects"
          @click="onClick"
          :collisions.sync="collisions"
        />
      </TimelineRow>
      <TimelineRow name="Title 2">
        <TimelineRowRects :items="rects2" @click="onClick" />
      </TimelineRow>

      <template #tooltip>
        <div>MyTooltip</div>
      </template>
    </Timeline>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Timeline, TimelineRow, TimelineRowRects } from "../index";
// console.dir(TimelineRow);

@Component<TimelineView>({
  components: {
    Timeline,
    TimelineRow,
    TimelineRowRects
  }
})
export default class TimelineView extends Vue {
  private period = {
    start: { hours: 8, minutes: 0 },
    end: { hours: 22, minutes: 0 }
  };

  private endHours = 12;
  private showTimestamps = true;

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

  private rects2 = [
    {
      start: {
        hours: 10,
        minutes: 0
      },
      end: {
        hours: 15,
        minutes: 0
      },
      data: "#1"
    }
  ];

  private collisions = [];

  private onClick(item: unknown) {
    // console.log("click", item);
  }
}
</script>
