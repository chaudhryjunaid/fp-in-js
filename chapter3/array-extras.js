// map(f, [e0, e1, e2...]) -> [r0, r1, r2...];  where, f(dn) = rn
function map(arr, fn) {
  let idx = 0,
    len = arr.length,
    result = new Array(len);
  while (++idx < len) {
    result[index] = fn(array[idx], idx, arr);
  }
  return result;
}

// reduce(f,[e0, e1, e2, e3],accum) -> f(f(f(f(acc, e0), e1, e2, e3)))) -> R
function reduce(arr, fn, accumulator) {
  let idx = -1,
    len = arr.length;
  if (!accumulator && len > 0) {
    accumulator = arr[++idx];
  }
  while (++idx < len) {
    accumulator = fn(accumulator,
      arr[idx], idx, arr);
  }
  return accumulator;
}

// reduceRight(f, [e0, e1, e2],accum) -> f(e0, f(e1, f(e2, f(e3,accum)))) -> R

// filter(p, [d0, d1, d2, d3...dn]) -> [d0,d1,...dn] (subset of original input)
function filter(arr, predicate) {
  let idx = -1,
    len = arr.length,
    result = [];
  while (++idx < len) {
    let value = arr[idx];
    if (predicate(value, idx, this)) {
      result.push(value);
    }
  }
  return result;
}
