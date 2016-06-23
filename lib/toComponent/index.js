"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _immutable = require("immutable");

var _alexeisavcaFtoolsDstructsMapObjValues = require("@alexeisavca/ftools/dstructs/mapObjValues");

var _alexeisavcaFtoolsDstructsMapObjValues2 = _interopRequireDefault(_alexeisavcaFtoolsDstructsMapObjValues);

var _alexeisavcaFtoolsDstructsMapObjTuples = require("@alexeisavca/ftools/dstructs/mapObjTuples");

var _alexeisavcaFtoolsDstructsMapObjTuples2 = _interopRequireDefault(_alexeisavcaFtoolsDstructsMapObjTuples);

var _alexeisavcaFtoolsStringsCapitalize = require("@alexeisavca/ftools/strings/capitalize");

var _alexeisavcaFtoolsStringsCapitalize2 = _interopRequireDefault(_alexeisavcaFtoolsStringsCapitalize);

var module2component = function module2component(_ref) {
    var _ref$model = _ref.model;
    var model = _ref$model === undefined ? (0, _immutable.fromJS)({}) : _ref$model;
    var _ref$adopt = _ref.adopt;
    var adopt = _ref$adopt === undefined ? {} : _ref$adopt;
    var view = _ref.view;
    return (function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class() {
            var _this = this;

            _classCallCheck(this, _class);

            for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
                props[_key] = arguments[_key];
            }

            _get(Object.getPrototypeOf(_class.prototype), "constructor", this).apply(this, props);
            var mkValueAccessor = function mkValueAccessor(key) {
                return function (maybeVal) {
                    return "undefined" == typeof maybeVal ? _this.props.model.get(key) : _this.props.send("change", key, "function" == typeof maybeVal ? maybeVal(_this.props.model.get(key)) : maybeVal);
                };
            };

            var accessors = {};
            model.keySeq().forEach(function (key) {
                return accessors[key] = mkValueAccessor(key);
            });
            Object.keys(adopt).forEach(function (key) {
                return accessors[key] = mkValueAccessor(key);
            });

            this.getAccessors = function () {
                return accessors;
            };

            var boundClasses = (0, _alexeisavcaFtoolsDstructsMapObjValues2["default"])(adopt, module2component);

            var bindChild = function bindChild() {
                for (var _len2 = arguments.length, path = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    path[_key2] = arguments[_key2];
                }

                return function () {
                    var _props$send;

                    return _immutable.List.isList(_this.props.model.getIn(path)) ? _this.props.model.getIn(path).map(function (_, index) {
                        return bindChild.apply(undefined, path.concat([index]))();
                    }) : _react2["default"].createElement(boundClasses[path[0]], {
                        model: _this.props.model.getIn(path),
                        send: (_props$send = _this.props.send).bind.apply(_props$send, [null].concat(path))
                    });
                };
            };

            var boundChildren = (0, _alexeisavcaFtoolsDstructsMapObjTuples2["default"])(adopt, function (_ref2) {
                var _ref22 = _slicedToArray(_ref2, 2);

                var key = _ref22[0];
                var module = _ref22[1];
                return [(0, _alexeisavcaFtoolsStringsCapitalize2["default"])(key), bindChild(key)];
            });

            this.getBoundChildren = function () {
                return boundChildren;
            };
        }

        _createClass(_class, [{
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate(nextProps) {
                return this.props.model != nextProps.model;
            }
        }, {
            key: "render",
            value: function render() {
                return view(this.getAccessors(), this.getBoundChildren(), this.props.send, this.props.model);
            }
        }]);

        return _class;
    })(_react2["default"].Component);
};

exports["default"] = module2component;
module.exports = exports["default"];

//# sourceMappingURL=index.js.map