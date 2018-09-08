// checkType :: Type -> Type -> Type | TypeError
const checkType = R.curry(function(typeDef, actualType) {
  if (R.is(typeDef, actualType)) {
    return actualType;
  } else {
    throw new TypeError(`Type mismatch. Expected[${typeDef}] but found[${typeof actualType}]`);
  }
});
checkType(String)('Curry'); //-> String
checkType(Number)(3); //-> Number
checkType(Date)(new Date()); //-> Date
checkType(Object)({}); //-> Object
checkType(String)(42); //-> Throws TypeError

const Tuple = function( /* types */ ) {
  const typeInfo = Array.prototype.slice.call(arguments, 0);
  const _T = function( /* values */ ) {
    const values = Array.prototype.slice.call(arguments, 0);
    if (values.some((val) =>
        val === null || val === undefined)) {
      throw new ReferenceError('Tuples may not have
        any null values ');
      }
      if (values.length !== typeInfo.length) {
        throw new TypeError('Tuple arity does not
          match its prototype ');
        }
        values.map(function(val, index) {
          this['_' + (index + 1)] = checkType(typeInfo[index])(val);
        }, this);
        Object.freeze(this);
      }
    }
  };
  _T.prototype.values = function() {
    return Object.keys(this).map(function(k) {
      return this[k];
    }, this);
  };
  return _T;
};

const Status = Tuple(Boolean, String);
const StringPair = Tuple(String, String);
const name = new StringPair('Barkley', 'Rosser');
[first, last] = name.values();
