const generateNumberArray = (start: number, end: number): number[] => {
  if (start > end) {
    return [];
  }
  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  );
}

export { generateNumberArray }
