"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require("immutable");

var buildModel = function buildModel(_ref) {
    var _ref$model = _ref.model;
    var model = _ref$model === undefined ? (0, _immutable.fromJS)({}) : _ref$model;
    var _ref$adopt = _ref.adopt;
    var adopt = _ref$adopt === undefined ? {} : _ref$adopt;
    return Object.keys(adopt).reduce(function (model, key) {
        return model.has(key) ? model : model.set(key, buildModel(adopt[key]));
    }, model);
};

exports["default"] = buildModel;
module.exports = exports["default"];

//# sourceMappingURL=index.js.map