import React from "react";
import {fromJS} from "immutable";
import inc from "@alexeisavca/ftools/math/inc";
import dec from "@alexeisavca/ftools/math/dec";

export default {
  model: fromJS({
    value: 0
  }),

  view: ({value}) => <span>
    <button onClick={e => value(inc)}>+</button>
    <button onClick={e => value(dec)}>-</button>
    {value()}
  </span>
};