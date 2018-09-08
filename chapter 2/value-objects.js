// Value Object #1: zipCode
function zipCode(code, location) {
  let _code = code;
  let _location = location || '';
  return {
    code: function() {
      return _code;
    },
    location: function() {
      return _location;
    },
    fromString: function(str) {
      let parts = str.split('-');
      return zipCode(parts[0], parts[1]);
    },
    toString: function() {
      return _code + '-' + _location;
    }
  };
}

// sample zipCode usage
const princetonZip = zipCode('08544', '3345');
princetonZip.toString(); //-> '08544-3345'

// Value Object #2: coordinate
function coordinate(lat, long) {
  let _lat = lat;
  let _long = long;
  return {
    latitude: function() {
      return _lat;
    },
    longitude: function() {
      return _long;
    },
    translate: function(dx, dy) {
      return coordinate(_lat + dx, _long + dy);
    },
    toString: function() {
      return '(' + _lat + ',' + _long + ')';
    }
  };
}

// sample coordinate usage
const greenwich = coordinate(51.4778, 0.0015);
greenwich.toString(); //-> '(51.4778, 0.0015)'

// returning new objects is another way to implement immutability
greenwich.translate(10, 10).toString(); //-> '(61.4778, 10.0015)'
