import React from "react";
import ReactDOM from "react-dom";
import {fromJS, List} from "immutable";
import module2component from "./lib/toComponent";

export default function(domNode, module){
  let Root = module2component(module);
  let render = model => ReactDOM.render(
      React.createElement(Root, {model, send: receive})
  );
  let computeModel = ({model = fromJS({}), adopt = {}}) =>
      Object.keys(adopt).reduce((model, key) => model.has(key) ? model :
          model.set(key, computeModel(adopt[key])), model);
  let model = computeModel(module);

  function receive(...params){
    try{
      model = update(module, model, ...params);
      render(model);
    } catch(e){
      if("NoActionHandler" == e){
        console.error("Could not find handler for action", params);
      } else throw e;
    }
  }

  function match([head, ...tail], target){
    switch(typeof target[head]){
      case "function" : return target[head](model, ...tail);
      case "object": return match(tail, target[head]);
    }
    if("undefined" != typeof target._) return match(['_', ...tail], target)
  }

  function update(module, model, head, ...tail){
    let matchResult = match([head, ...tail], module.actions || {});
    if(null !== matchResult && "undefined" != typeof matchResult) return matchResult;

    if(module.adopt && module.adopt[head]) {
      let path = List.isList(model.get(head)) ? [head, tail.shift()] : [head];
      return model.setIn(path, update(module.adopt[head], model.getIn(path), ...tail))
    }

    if("change" == head){
      let [key, val] = tail;
      return model.set(key, val);
    }

    throw "NoActionHandler";
  }

  render(model);
}