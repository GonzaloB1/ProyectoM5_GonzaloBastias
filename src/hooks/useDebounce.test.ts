import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("devuelve el valor inicial inmediatamente", () => {
    const { result } = renderHook(() => useDebounce("hola", 300));
    expect(result.current).toBe("hola");
  });

  it("no actualiza el valor antes de que pase el delay", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "ab" });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("a");

    vi.useRealTimers();
  });

  it("actualiza el valor después de que pasa el delay completo", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "ab" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("ab");

    vi.useRealTimers();
  });
});