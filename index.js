"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _immutable = require("immutable");

var _libToComponent = require("./lib/toComponent");

var _libToComponent2 = _interopRequireDefault(_libToComponent);

var _libBuildModelIndexEs6 = require("./lib/buildModel/index.es6");

var _libBuildModelIndexEs62 = _interopRequireDefault(_libBuildModelIndexEs6);

exports["default"] = function (domNode, module) {
  var Root = (0, _libToComponent2["default"])(module);
  var render = function render(model) {
    return _reactDom2["default"].render(_react2["default"].createElement(Root, { model: model, send: receive }));
  };

  var model = (0, _libBuildModelIndexEs62["default"])(module);

  function receive() {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    try {
      model = update(module, model, params);
      render(model);
    } catch (e) {
      if ("NoActionHandler" == e.message) {
        console.error("Could not find handler for action", params);
      } else if ("InvalidState" == e.message) {
        console.error("Invalid state returned by an action handler while trying to perform", params);
      } else throw e;
    }
  }

  var NO_MATCH_FOUND = Symbol();

  function match(_x2, _x3, _x4, _x5) {
    var _again = true;

    _function: while (_again) {
      var model = _x2,
          _ref = _x3,
          target = _x4,
          nextState = _x5;

      var _ref2 = _toArray(_ref);

      var head = _ref2[0];

      var tail = _ref2.slice(1);

      _again = false;

      switch (typeof target[head]) {
        case "function":
          var result = target[head].apply(target, [model, nextState].concat(_toConsumableArray(tail)));
          if (!_immutable.Iterable.isIterable(result)) throw new Error("InvalidState");
          return result;
        case "object":
          _x2 = model;
          _x3 = tail;
          _x4 = target[head];
          _x5 = nextState;
          _again = true;
          _ref2 = head = tail = result = undefined;
          continue _function;

      }
      if ("undefined" != typeof target._) {
        _x2 = model;
        _x3 = ['_'].concat(_toConsumableArray(tail));
        _x4 = target;
        _x5 = nextState;
        _again = true;
        _ref2 = head = tail = result = undefined;
        continue _function;
      }
      return NO_MATCH_FOUND;
    }
  }

  function update(module, model, _ref3) {
    var _ref32 = _toArray(_ref3);

    var head = _ref32[0];

    var tail = _ref32.slice(1);

    var dontMatch = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    if (!dontMatch) {
      var nextState = update.bind(null, module, model, [head].concat(_toConsumableArray(tail)), true);
      var matchResult = match(model, [head].concat(_toConsumableArray(tail)), module.actions || {}, nextState);
      if (matchResult != NO_MATCH_FOUND) return matchResult;
    }

    if (module.adopt && module.adopt[head]) {
      var path = _immutable.List.isList(model.get(head)) ? [head, tail.shift()] : [head];
      return model.setIn(path, update(module.adopt[head], model.getIn(path), tail));
    }

    if ("change" == head) {
      var _tail = _slicedToArray(tail, 2);

      var key = _tail[0];
      var val = _tail[1];

      return model.set(key, val);
    }

    throw new Error("NoActionHandler");
  }

  render(model);
};

module.exports = exports["default"];

//# sourceMappingURL=index.js.map