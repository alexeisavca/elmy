import React from "react";
import Counter from "./counter";
import {fromJS} from "immutable";
import buildModel from "../lib/buildModel/index.es6";

let DeletableCounter = {
  adopt: {counter: Counter},

  view: (_, {Counter}, send) => <div>
    {Counter()}
    <i className="glyphicon glyphicon-trash" onClick={e => send("delete")}></i>
  </div>
};

let add = counters => counters.push(buildModel(DeletableCounter));

export default {
  model: fromJS({counters: []}),

  adopt: {counters: DeletableCounter},

  actions: {
    counters: (state, nextState, index, action) => "delete" == action ? state.deleteIn(['counters', index]) : nextState()
  },

  view: ({counters}, {Counters}) => <div>
    {Counters()}
    <div>
      <button onClick={e => counters(add)}>Add new</button>
    </div>
  </div>
}