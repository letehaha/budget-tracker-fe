import { useDebounce, useWindowSize } from "@vueuse/core";
import { computed, ComputedRef } from "vue";

interface Options {
  debounce?: number; // Debounce wait time (default: 300ms)
  direction?: "up" | "down"; // "down" for <=, "up" for >= (default: "down")
}

export const CUSTOM_BREAKPOINTS = Object.freeze({
  uiMobile: 768,
});

type Breakpoint = number | (typeof CUSTOM_BREAKPOINTS)[keyof typeof CUSTOM_BREAKPOINTS];

export function useWindowBreakpoints(size: Breakpoint, options?: Options): ComputedRef<boolean>;
export function useWindowBreakpoints(size: Breakpoint[], options?: Options): ComputedRef<boolean[]>;

export function useWindowBreakpoints(
  size: Breakpoint | Breakpoint[],
  options: Options = {},
): ComputedRef<boolean | boolean[]> {
  const { debounce = 300, direction = "down" } = options;
  const { width: windowWidth } = useWindowSize();
  const debouncedWindowWidth = useDebounce(windowWidth, debounce);

  const isExpectedSize = computed(() => {
    if (Array.isArray(size)) {
      return size.map((breakpoint) =>
        direction === "down"
          ? debouncedWindowWidth.value <= breakpoint
          : debouncedWindowWidth.value >= breakpoint,
      );
    }

    return direction === "down"
      ? debouncedWindowWidth.value <= size
      : debouncedWindowWidth.value >= size;
  });

  return isExpectedSize;
}
