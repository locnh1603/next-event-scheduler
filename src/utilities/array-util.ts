import {AppError} from '@/utilities/error-handler';

const generateNumberArray = (start: number, end: number): number[] => {
  if (start > end) {
    return [];
  }
  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  );
}

const generateUniqueArray = <T>(arrays: T[][]): T[] => {
  if (!Array.isArray(arrays)) {
    throw new AppError(500, {} ,'Input must be an array');
  }
  if (arrays.length === 0) {
    return [];
  }
  return [...new Set(arrays.flat())];
}

export { generateNumberArray, generateUniqueArray }
