import run from "../index.es6";
import Counter from './counter';
import counterCode from "!!raw!./counter.jsx";
import LockableCounter from "./lockable-counter";
import lockableCounterCode from "!!raw!./lockable-counter";
import Counters from "./counters";
import countersCode from "!!raw!./counters";
import React from "react";
import Highlight from "react-highlight";
import highlightStyles from "react-highlight/node_modules/highlight.js/styles/solarized_light.css";

class ReactIgnore extends React.Component{
  shouldComponentUpdate(){
    return false;
  }

  render(){
    return this.props.children;
  }
}

let mkExample = (title, code, Module) => ({
  adopt: {
    module: Module
  },

  view: (_, {Module}) =>
      <div className="row">
        <div className="col-md-12">
          <h1>
            &nbsp;
            <small>{title}</small>
          </h1>
        </div>
        <div className="col-md-6">
          <ReactIgnore>
            <Highlight className="javascript">
              {code}
            </Highlight>
          </ReactIgnore>
        </div>
        <div className="col-md-6">
          {Module()}
        </div>
      </div>
});

run(document.getElementById('vdom-container'), {
  adopt: {
    counter: mkExample('Counter', counterCode, Counter),
    lockableCounter: mkExample('Lockable counter', lockableCounterCode, LockableCounter),
    counters: mkExample('Multiple counters', countersCode, Counters)
  },

  view: (_, {Counter, LockableCounter, Counters}) => <div className="container-fluid">
    <h1 className="page-header">
      Elmy examples
    </h1>
    {Counter()}
    {LockableCounter()}
    {Counters()}
  </div>
});