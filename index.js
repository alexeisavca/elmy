"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
      model = update.apply(undefined, [module, model].concat(params));
      render(model);
    } catch (e) {
      if ("NoActionHandler" == e) {
        console.error("Could not find handler for action", params);
      } else throw e;
    }
  }

  function match(_x, _x2, _x3) {
    var _arguments = arguments;
    var _again = true;

    _function: while (_again) {
      var model = _x,
          _ref = _x2,
          target = _x3;

      var _ref2 = _toArray(_ref);

      var head = _ref2[0];

      var tail = _ref2.slice(1);

      _again = false;

      switch (typeof target[head]) {
        case "function":
          return target[head].apply(target, [model].concat(_toConsumableArray(tail)));
        case "object":
          _arguments = [_x = model, _x2 = tail, _x3 = target[head]];
          _again = true;
          _ref2 = head = tail = undefined;
          continue _function;

      }
      if ("undefined" != typeof target._) {
        _arguments = [_x = model, _x2 = ['_'].concat(_toConsumableArray(tail)), _x3 = target];
        _again = true;
        _ref2 = head = tail = undefined;
        continue _function;
      }
    }
  }

  function update(module, model, head) {
    for (var _len2 = arguments.length, tail = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      tail[_key2 - 3] = arguments[_key2];
    }

    var matchResult = match(model, [head].concat(tail), module.actions || {});
    if (null !== matchResult && "undefined" != typeof matchResult) return matchResult;

    if (module.adopt && module.adopt[head]) {
      var path = _immutable.List.isList(model.get(head)) ? [head, tail.shift()] : [head];
      return model.setIn(path, update.apply(undefined, [module.adopt[head], model.getIn(path)].concat(tail)));
    }

    if ("change" == head) {
      var key = tail[0];
      var val = tail[1];

      return model.set(key, val);
    }

    throw "NoActionHandler";
  }

  render(model);
};

module.exports = exports["default"];

//# sourceMappingURL=index.js.map