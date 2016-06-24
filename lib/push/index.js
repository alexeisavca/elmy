"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _buildModelIndexEs6 = require("../buildModel/index.es6");

var _buildModelIndexEs62 = _interopRequireDefault(_buildModelIndexEs6);

exports["default"] = function (model) {
  return function (items) {
    return items.push((0, _buildModelIndexEs62["default"])(model));
  };
};

module.exports = exports["default"];

//# sourceMappingURL=index.js.map