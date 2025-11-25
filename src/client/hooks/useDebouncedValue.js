import { useState, useEffect } from 'react';

function useDebouncedValue(value, delay = 300) {
  const [state, setState] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setState(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return state;
}

export default useDebouncedValue;
