import React from "react";
import ReactDOM from "react-dom";
import {List, Iterable} from "immutable";
import module2component from "./lib/toComponent";
import buildModel from "./lib/buildModel/index.es6";

export default function(domNode, module){
  let Root = module2component(module);
  let render = model => ReactDOM.render(
      React.createElement(Root, {model, send: receive})
  );

  let model = buildModel(module);

  function receive(...params){
    try{
      model = update(module, model, ...params);
      render(model);
    } catch(e){
      if("NoActionHandler" == e.message) {
        console.error("Could not find handler for action", params);
      } else if("InvalidState" == e.message){
        console.error("Invalid state returned by an action handler while trying to perform", params);
      } else throw e;
    }
  }

  function match(model, [head, ...tail], target){
    switch(typeof target[head]){
      case "function" :
        let result = target[head](model, ...tail);
        if(!Iterable.isIterable(result)) throw new Error("InvalidState");
        return result;
      case "object": return match(model, tail, target[head]);
    }
    if("undefined" != typeof target._) return match(model, ['_', ...tail], target)
  }

  function update(module, model, head, ...tail){
    let matchResult = match(model, [head, ...tail], module.actions || {});
    if(null !== matchResult && "undefined" != typeof matchResult) return matchResult;

    if(module.adopt && module.adopt[head]) {
      let path = List.isList(model.get(head)) ? [head, tail.shift()] : [head];
      return model.setIn(path, update(module.adopt[head], model.getIn(path), ...tail))
    }

    if("change" == head){
      let [key, val] = tail;
      return model.set(key, val);
    }

    throw new Error("NoActionHandler");
  }

  render(model);
}