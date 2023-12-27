import { sorting } from '../utils/sorting';

function generateSorting(points) {
  return Object.entries(sorting).map(
    ([sortingType, sortingPoints]) => ({
      type: sortingType,
      count: sortingPoints(points).length,
    }),
  );
}

export {generateSorting};
