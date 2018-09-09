// Wrapper monad
class Wrapper {
  constructor(value) {
    this._value = value;
  }
  static of (a) {
    return new Wrapper(a);
  }
  map(f) {
    return Wrapper.of(f(this.value));
  }
  join() {
    if (!(this.value instanceof Wrapper)) {
      return this;
    }
    return this.value.join();
  }
  toString() {
    return `Wrapper (${this.value})`;
  }
}

Wrapper.of('Hello Monads!')
  .map(R.toUpper)
  .map(R.identity); //-> Wrapper('HELLO MONADS!')

Wrapper.of(Wrapper.of(Wrapper.of('Get Functional'))).join();
//-> Wrapper('Get Functional')


// Maybe monad
class Maybe {
  static just(a) {
    return new Just(a);
    static nothing() {
      return new Nothing();
    }
    static fromNullable(a) {
      return a !== null ? just(a) : nothing();
    }
    static of (a) {
      return just(a);
    }
    get isNothing() {
      return false;
    }
    get isJust() {
      return false;
    }
  }
}
class Just extends Maybe {
  constructor(value) {
    super();
    this._value = value;
  }
  get value() {
    return this._value;
  }
  map(f) {
    return of(f(this.value));
  }
  getOrElse() {
    return this.value;
  }
  filter(f) {
    Maybe.fromNullable(f(this.value) ? this.value : null);
  }
  get isJust() {
    return true;
  }
  toString() {
    return `Maybe.Just(${this.value})`;
  }
}
class Nothing extends Maybe {
  map(f) {
    return this;
  }
  get value() {
    throw new TypeError('Can\'t extract the value of a Nothing.');
  }
  getOrElse(other) {
    return other;
  }
  filter() {
    return this.value;
  }
  get isNothing() {
    return true;
  }
  toString() {
    return 'Maybe.Nothing';
  }
}

// Lift implementation
const lift = R.curry(function(f, value) {
  return Maybe.fromNullable(value).map(f);
});

// Either monad
class Either {
  constructor(value) {
    this._value = value;
  }
  get value() {
    return this._value;
  }
  static left(a) {
    return new Left(a);
  }
  static right(a) {
    return new Right(a);
  }
  static fromNullable(val) {
    return val !== null ? right(val) : left(val);
  }
  static of (a) {
    return right(a);
  }
}
class Left extends Either {
  map(_) {
    return this; // noop
  }
  get value() {
    throw new TypeError('Can\'t extract the value of a Left(a).');
  }
  getOrElse(other) {
    return other;
  }
  orElse(f) {
    return f(this.value);
  }
  chain(f) {
    return this;
  }
  getOrElseThrow(a) {
    throw new Error(a);
  }
  filter(f) {
    return this;
  }
  toString() {
    return `Either.Left(${this.value})`;
  }
}

class Right extends Either {
  map(f) {
    return Either.of(f(this.value));
  }
  getOrElse(other) {
    return this.value;
  }
  orElse() {
    return this;
  }
  chain(f) {
    return f(this.value);
  }
  getOrElseThrow(_) {
    return this.value;
  }
  filter(f) {
    return Either.fromNullable(f(this.value) ? this.value : null);
  }
  toString() {
    return `Either.Right(${this.value})`;
  }
}


// Either can guard against functions that throw exceptions
function decode(url) {
  try {
    const result = decodeURIComponent(url);
    return Either.of(result);
  } catch (uriError) {
    return Either.Left(uriError);
  }
}

// IO monad
class IO {
  constructor(effect) {
    if (!_.isFunction(effect)) {
      throw 'IO Usage: function required';
    }
    // The IO constructor is initialized with a read/write operation (like reading or writing to the DOM). This operation is also known as the effect function.
    this.effect = effect;
  }

  // Unit functions to lift values and functions into the IO monad
  static of (a) {
    return new IO(() => a);
  }
  static from(fn) {
    return new IO(fn);
  }
  map(fn) {
    var self = this;
    return new IO(function() {
      return fn(self.effect());
    });
  }
  chain(fn) {
    return fn(this.effect());
  }
  run() {
    return this.effect();
  }
}

// Example of the IO monad
const read = function(document, id) {
  return function() {
    return document.querySelector(`\#${id}`).innerHTML;
  };
};
const write = function(document, id) {
  return function(val) {
    return document.querySelector(`\#${id}`).innerHTML = val;
  };
};

const readDom = _.partial(read, document);
const writeDom = _.partial(write, document);

const changeToStartCase =
  IO.from(readDom('student-name'))
  .map(_.startCase)
  .map(writeDom('student-name'));

changeToStartCase.run(); // run the IO operations


// Generalized Curried Polymorphic chain and map that enable use of monads with compose
// map :: (ObjectA -> ObjectB), Monad -> Monad[ObjectB]
const map = R.curry(function(f, container) {
  return container.map(f);
});
// chain :: (ObjectA -> ObjectB), M -> ObjectB
const chain = R.curry(function(f, container) {
  return container.chain(f);
});


// monad example using chains

// validLength :: Number, String -> Boolean
const validLength = (len, str) => str.length === len;
// checkLengthSsn :: String -> Either(String)
const checkLengthSsn = function(ssn) {
  return Either.of(ssn).filter(_.bind(validLength, undefined, 9))
    .getOrElseThrow(`Input: ${ssn} is not a valid SSN number`);
};
// safeFindObject :: Store, string -> Either(Object)
const safeFindObject = R.curry(function(db, id) {
  return Either.fromNullable(find(db, id))
    .getOrElseThrow(`Object not found with ID: ${id}`);
});
// finStudent :: String -> Either(Student)
const findStudent = safeFindObject(DB('students'));
// csv :: Array => String
const csv = arr => arr.join(',');

// Methods map and chain can be used to transform the value in the monad.
// Map returns a monad; to avoid nesting and having to flatten the structure, 
//  weave map with chain to keep a single monad level flowing through the calls.
const showStudent = (ssn) =>
  Maybe.fromNullable(ssn)
  .map(cleanInput)
  .chain(checkLengthSsn)
  .chain(findStudent)
  .map(R.props(['ssn', 'firstname', 'lastname']))
  .map(csv)
  .map(append('#student-info'));


// monad example using compose

const debugLog = _.partial(logger, 'console', 'basic', 'Monad Example', 'TRACE');
const errorLog = _.partial(logger, 'console', 'basic', 'Monad Example', 'ERROR');
const trace = R.curry((msg, val) => debugLog(msg + ':' + val));

const showStudent = R.compose(
  R.tap(trace('Student added to HTML page')) map(append('#student-info')),
  R.tap(trace('Student info converted to CSV')),
  map(csv),
  map(R.props(['ssn', 'firstname', 'lastname'])),
  R.tap(trace('Record fetched successfully!')),
  chain(findStudent),
  R.tap(trace('Input was valid')),
  chain(checkLengthSsn),
  lift(cleanInput));


// improved example using compose
const showStudent = R.compose(
  map(append('#student-info')),
  liftIO,
  map(csv),
  map(R.props(['ssn', 'firstname', 'lastname'])),
  chain(findStudent),
  chain(checkLengthSsn),
  lift(cleanInput));
