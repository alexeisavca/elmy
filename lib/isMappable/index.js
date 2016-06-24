"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require("immutable");

exports["default"] = function (maybeMappable) {
  return _immutable.List.isList(maybeMappable) || _immutable.OrderedMap.isOrderedMap(maybeMappable);
};

module.exports = exports["default"];

//# sourceMappingURL=index.js.map