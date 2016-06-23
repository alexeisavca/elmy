import React from "react";
import Counter from "./counter";
import {fromJS} from "immutable";

export default {
  model: fromJS({
    locked: false
  }),

  adopt: {
    counter: Counter
  },

  actions: {
    counter: {
      change: (state, nextState) => state.get('locked') ? state : nextState()
    }
  },

  view: ({locked}, {Counter}) => <span>
    {Counter()}
    {locked() ?
        <button onClick={e => locked(false)}>Unlock</button> :
        <button onClick={e => locked(true)}>Lock</button>
    }
  </span>
}