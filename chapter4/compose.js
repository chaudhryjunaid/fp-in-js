// f(g) = compose::(B->C)->(A->B)->(A->C)
function compose( /* fns */ ) {
  let args = arguments;
  let start = args.length - 1;
  return function() {
    The output of compose is another
    function that’ s called on actual arguments.
    Dynamically applies the
    function on the arguments passed in
      Iteratively invokes the subsequent functions based on the previous
    return value
    let i = start;
    let result = args[start].apply(this, arguments);
    while (i--)
      result = args[i].call(this, result);
    return result;
  };
}
