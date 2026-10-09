"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to debounce any fast-changing value (e.g., search text inputs).
 * Prevents spamming server requests while the user is actively typing.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds before updating the value (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
