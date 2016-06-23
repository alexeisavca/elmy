import React from "react";
import {fromJS, List} from "immutable";
import mapObjValues from "@alexeisavca/ftools/dstructs/mapObjValues";
import mapObjTuples from "@alexeisavca/ftools/dstructs/mapObjTuples";
import capitalize from "@alexeisavca/ftools/strings/capitalize";

let module2component = ({model = fromJS({}), adopt = {}, view}) => class extends React.Component{
  constructor(...props){
    super(...props);
    let mkValueAccessor = key =>
        maybeVal => "undefined" == typeof maybeVal ?
            this.props.model.get(key) :
            this.props.send("change", key,
                "function" == typeof maybeVal ? maybeVal(this.props.model.get(key)) : maybeVal
            );

    let accessors = {};
    model.keySeq().forEach(key => accessors[key] = mkValueAccessor(key));
    Object.keys(adopt).forEach(key => accessors[key] = mkValueAccessor(key));

    this.getAccessors = () => accessors;

    let boundClasses = mapObjValues(adopt, module2component);

    let bindChild = (...path) => () => List.isList(this.props.model.getIn(path)) ?
        this.props.model.getIn(path).map((_, index) => bindChild(...path, index)()) :
        React.createElement(boundClasses[path[0]], {
          model: this.props.model.getIn(path),
          send: this.props.send.bind(null, ...path)
        });

    let boundChildren = mapObjTuples(adopt, ([key, module]) => [capitalize(key), bindChild(key)]);

    this.getBoundChildren = () => boundChildren;
  }

  shouldComponentUpdate(nextProps){
    return this.props.model != nextProps.model;
  }

  render(){
    return view(this.getAccessors(), this.getBoundChildren(), this.props.send, this.props.model);
  }
};

export default module2component;