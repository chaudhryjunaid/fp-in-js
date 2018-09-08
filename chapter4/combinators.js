const alt = function(func1, func2) {
  return function(val) {
    return func1(val) || func2(val);
  }
};

const alt = R.curry((func1, func2, val) => func1(val) || func2(val));

const seq = function( /*funcs*/ ) {
  const funcs = Array.prototype.slice.call(arguments);
  return function(val) {
    funcs.forEach(function(fn) {
      fn(val);
    });
  };
}

const fork = function(join, func1, func2) {
  return function(val) {
    return join(func1(val), func2(val));
  };
};

const getLetterGrade = (n) => n >= 90 ? 'A' : 'B';
const computeAverageGrade =
  R.compose(getLetterGrade, fork(R.divide, R.sum, R.length));
computeAverageGrade([99, 80, 89]); //-> 'B'
