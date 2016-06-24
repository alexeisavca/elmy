"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _buildModel = require("../buildModel");

var _buildModel2 = _interopRequireDefault(_buildModel);

exports["default"] = function (model) {
  return function (items) {
    return items.push((0, _buildModel2["default"])(model));
  };
};

module.exports = exports["default"];

//# sourceMappingURL=index.js.map