import React from "react";
import Counter from "./counter";
import {fromJS} from "immutable";
import push from "../lib/push";

let DeletableCounter = {
  adopt: {counter: Counter},

  view: (_, {Counter}, send) => <div>
    {Counter()}
    <i className="glyphicon glyphicon-trash" onClick={e => send("delete")}></i>
  </div>
};

export default {
  model: fromJS({counters: []}),

  adopt: {counters: DeletableCounter},

  update: {
    counters: (state, nextState, index, action) => "delete" == action ? state.deleteIn(['counters', index]) : nextState()
  },

  view: ({counters}, {Counters}) => <div>
    {Counters()}
    <div>
      <button onClick={e => counters(push(DeletableCounter))}>Add new</button>
    </div>
  </div>
}