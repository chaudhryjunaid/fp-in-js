// curry(f) :: (a,b) -> f(a) -> f(b)
function curry2(fn) {
  return function(firstArg) {
    return function(secondArg) {
      return fn(firstArg, secondArg);
    };
  };
}


// partial
function partial() {
  let fn = this,
    boundArgs = Array.prototype.slice.call(arguments);
  let placeholder = '_'; // <<partialPlaceholderObj>>
  let bound = function() {
    let position = 0,
      length = args.length;
    let args = Array(length);
    for (let i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ?
        arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) {
      args.push(arguments[position++]);
    }
    return fn.apply(this, args);
  };
  return bound;
});
