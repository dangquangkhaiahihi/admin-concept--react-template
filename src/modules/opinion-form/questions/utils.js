// a little function to help us with reordering the result
export const Reorder = (list, startIndex, endIndex) => {
  let result = Array.from(list);
  let [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // let startOrder = result[startIndex].order;
  // result[startIndex].order = result[endIndex].order;
  // result[endIndex].order = startOrder;

  return result.map((item, index) => {
    return {
      ...item,
      order: index + 1,
    };
  });
};
