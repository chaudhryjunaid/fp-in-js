
// Wrapper data type
//Simple type that stores a single value of any type
// Notice: there's not get method on this type
// Value is accessed by mapping over the Wrapper using the identity combinator
class Wrapper { 
  constructor(value) {
    this._value = value;
  }
  // map :: (A -> B) -> A -> B
  map(f) { // Maps a function over this type (just like arrays)
    return f(this._value);
  };

  toString() {
    return 'Wrapper (' + this._value + ')';
  }
}
// wrap :: A -> Wrapper(A)
const wrap = (val) => new Wrapper(val);

const wrappedValue = wrap('Get Functional');
wrappedValue.map(R.identity); //-> 'Get Functional'
wrappedValue.map(console.log);
wrappedValue.map(R.toUpper); //-> 'GET FUNCTIONAL'

// fmap :: (A -> B) -> Wrapper[A] -> Wrapper[B]
// Wraps the transformed value in the container before returning it to the caller
Wrapper.prototype.fmap = function (f) {
    return wrap(f(this.val));
};

// // Function as a Functor
// Function.prototype.map = function (f) {
//   const g = this
//   return function () {
//     return f(g.apply(this, arguments))
//   }
// }

