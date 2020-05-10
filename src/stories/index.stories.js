import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Timeline from "@/components/Timeline.vue";
import TimelineView from "./timeline-view.vue";

export default {
  component: Timeline,
  title: "Timeline"
};

export const timelineView = () => TimelineView;
