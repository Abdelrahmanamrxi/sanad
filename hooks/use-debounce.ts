import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, timeMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), timeMs);
    return () => clearTimeout(id);
  }, [value]);
  return debounced;
}
