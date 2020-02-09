import { shallowMount } from "@vue/test-utils";
import Timeline from "@/components/Timeline.vue";
import { Time } from "@/components/Types";

describe("Timeline.vue", () => {
  it("Gets time boundaries when props start and end passed", () => {
    const start: Time = {
      hours: 8,
      minutes: 0
    };
    const end: Time = {
      hours: 12,
      minutes: 0
    };
    const wrapper = shallowMount(Timeline, {
      propsData: { start, end }
    });
    expect((wrapper.props as any).start).not.toBeNull();
    expect((wrapper.props as any).end).not.toBeNull();
  });
});
