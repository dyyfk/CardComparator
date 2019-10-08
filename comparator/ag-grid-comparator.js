// Todo: Here should load the compare.js to enable custom compare function and scalability
const StringComparator = (valueA, valueB, nodeA, nodeB, isInverted) => {
  if (
    (valueA === undefined || valueA === null) &&
    (valueB === undefined || valueB === null)
  )
    return 0;

  if (valueA === undefined || valueA === null) return -1;
  if (valueB === undefined || valueB === null) return 1;

  return valueA.localeCompare(valueB);
}

const NumberComparator = (valueA, valueB, nodeA, nodeB, isInverted) => {
  if (
    (valueA === undefined || valueA === null) &&
    (valueB === undefined || valueB === null)
  )
    return 0;

  if (valueA === undefined || valueA === null) return -1;
  if (valueB === undefined || valueB === null) return 1;
  if (typeof valueA != "number") valueA = 0;
  if (typeof valueB != "number") valueB = 0;
  let val;
  if (typeof valueA == "string" && typeof valueB == "string")
    val = valueA.length - valueB.length;
  else if (typeof valueA == "number" && typeof valueB == "number")
    val = valueA - valueB;
  else val = valueA - valueB;
  return val;
}

export {
  StringComparator,
  NumberComparator
}