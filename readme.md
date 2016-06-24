# Elmy
Elmy is an implementation of [Elm architecture](http://guide.elm-lang.org/architecture/index.html) for JavaScript and
React using [Immutable.js](https://facebook.github.io/immutable-js/docs/#/) that tries to remove bloat and automatize
frequent and routine Elm architecture hacking.

## Overview

* The view of your app is defined by its model(state)
* The model structure mirrors your app structure

## Installation
    npm install elmy

Note that it has react, react-dom and immutable as its peer deps. After installation:

```js
import run from "elmy";

run(document.getElementById("your-container-id"), YourModule);
```

## Tutorial
Long story short, [Elm architecture](http://guide.elm-lang.org/architecture/index.html) means you have your application
structured into modules, a module includes a model, a view, and an update function. The view is much like a React component,
it transform data into DOM, the model is the state of the view, much like a Flux store and the update function updates
the model depending on user actions, so, sort of an action creator and a store listener merged together.

The model of a parent module includes the models of its children, the parent distributes its state to the children.
 And when a module wants to update, i.e. it sends an action, it sends it to its parent(which, if it's a child itself, will
  send it to its parent and so on)
 so the update function is ran from the top of the hierarchy down. The update function may or may not invoke the update
 function of its child, as well as it can map its child updated state.

### Counter
Let's start by implementing a counter application. It will have a button to increment it, a button to decrement it, and
it will display its current value. As in ELM, we'll structure our application into modules, and in our case a module is
just a plain Javascript object, but it must include _at least_ a _view_ function. So let's start with our view.

```js
const Counter = {
    view: () => <div>
        0
        <button>+</button>
        <button>-</button>
    </div>
}
```

So here we have our view, but it does nothing, yet. In order to make it do something, we must define our model. A model
is usually just an Immutable.Map

```js
const Counter = {
    model: fromJS({
        value: 0
    }),

    view: ({value}) => <div>
        {value()}
        <button>+</button>
        <button>-</button>
    </div>
}
```

So here we've defined our model, but there's something else going on in our view. That "value" thingy that the view now
extracts from its first argument is called an "accessor". An accessor is a function associated with a field in the model,
when called with no arguments, it just returns the value of the associated key, and that's exactly what it does at the 7th
line of the above snippet.

So now we have a model and a way to display it, we just need to update it when the user clicks the buttons.

```js
const Counter = {
    model: fromJS({
        value: 0
    }),

    view: ({value}) => <div>
        {value()}
        <button onClick={e => value(value() + 1)>+</button>
        <button onClick={e => value(value() - 1)>-</button>
    </div>
}
```

So we already know that when calling the accessor with no argument it will return the associated field from the model. But
when we give it an argument, it will actually update that field with that value. But here's another useful property of an
accessor, when called with a function argument, it will apply that function to the model. So given that _f_ is a function

```js
value(f)
```

would be the same as

```js
value(f(value()))
```

So if only we had some functions that increment and decrement their arguments, we can make this solution more elegant.
Here I'm using a dec and inc function from my collection of reusable functions [Ftools](https://github.com/alexeisavca/ftools)
but you can write your own

```js
import inc from "@alexeisavca/ftools/math/inc";
import dec from "@alexeisavca/ftools/math/inc";
const Counter = {
    model: fromJS({
        value: 0
    }),

    view: ({value}) => <div>
        {value()}
        <button onClick={e => value(inc)>+</button>
        <button onClick={e => value(dec)>-</button>
    </div>
}
```

And here's our counter, all done. You can check the full code [here](https://github.com/alexeisavca/elmy/blob/gh-pages/examples/counter.jsx)
and see it in action on the [examples](https://alexeisavca.github.io/elmy/) page.

### Unlimited counters
Now we're gonna implement an app that allows the user to add and remove counters. But to achieve that, we first must
make our counters removable.

#### A deletable counter
As usual, let's start with our view:

```js
const DeletableCounter = {
    view: () => <div>
        here be our counter
        <i className="glyphicon glyphicon-trash"/>
    </div>
}
```

So, as you can see, our Deletable counter is just a wrapper, that will wrap a Counter and add a delete button next to it.
So now let's just replace the placeholder text with our actual counter, to do that, we must first tell our DeletableCounter
to adopt Counter as a child, it will seem weird at start, but will make sense later:

```js
const DeletableCounter = {
    adopt: {
        deletable: Counter
    },

    view: () => <div>
        <i className="glyphicon glyphicon-trash"/>
    </div>
}
```

Notice the _adopt_ property, it does several things, but for starters, it tells DeletableCounter to include Counter's
model in its own, in a field called _deletable_. We can check it out to see that it's true.

```js
const DeletableCounter = {
    adopt: {
        deletable: Counter
    },

    view: ({deletable)) => <div>
        {JSON.stringify(deletable())}
        <i className="glyphicon glyphicon-trash"/>
    </div>
}
```

We should see something like _{value: 0}_. _adopt_ also does another thing, it generates a function that will pass to the
Counter the value of DeletableCounter's _deletable_ field instead of its original model, and, when Counter sends an action
(more on actions later) it will be routed through DeletableCounter. This function will be passed to the _view_ in its
second argument, and will be name as the capitalized model field, so, in our case "Deletable"

```js
const DeletableCounter = {
    adopt: {
        deletable: Counter
    },

    view: (_, {Deletable}) => <div>
        {Deletable()}
        <i className="glyphicon glyphicon-trash"/>
    </div>
}
```

We can also override this behaviour and send Deletable a model manually, by passing an argument to its call, but it's
 not recommended since it might break the "view state is defined by the model" principle.

 You might've also noticed that we didn't specify a model for DeletableCounter, that's because _adopt_ will do that for us,
 but we can if we want to, that will override the default Counter state:

```js
const DeletableCounter = {
    model: fromJS({
        deletable: Counter.model.set('value', 10)
    }),

    adopt: {
        deletable: Counter
    },

    view: (_, {Deletable}) => <div>
        {Deletable()}
        <i className="glyphicon glyphicon-trash"/>
    </div>
}
```

Now our counter will start with a default value of 10.

Just one more thing remains: DeletableCounter must somehow notify its parents that it's being deleted. To do that we introduce
the 3rd argument to our view function which is _send_, which sends actions. We will talk about actions more later
but for now we just need to know that _send_ takes and unlimited number of arguments and sends an action based on those.

```js
const DeletableCounter = {
    model: fromJS({
        deletable: Counter.model.set('value', 10)
    }),

    adopt: {
        deletable: Counter
    },

    view: (_, {Deletable}) => <div>
        {Deletable()}
        <i className="glyphicon glyphicon-trash" onClick={e => send("delete")}/>
    </div>
}
```

So here clicking on the trash icon will just send a "delete" action.

### Finalizing
Ok, now that we have our DeletableCounter that sends its action when needed, it's time to wrap it up. We'll start by creating
a module called Counter__s__

```js
var Counters = {
    view: () => <div>
        here be counters
        <div>
            <button>Add new</button>
        </div>
    </div>
}
```

Ok, we have a placeholder for counters and an add new button. Now, let's couple our new module with DeletableCounter

```js
var Counters = {
    model: fromJS({
        counters: []
    }),

    adopt: {
        counters: DeletableCounter
    },

    view: ({counters}, {Counters}) => <div>
        {Counters()}
        <div>
            <button>Add new</button>
        </div>
    </div>
}
```

As you see, we've overrode the default DeletableCounter state. That's because we need it to be a List(Immutable.js will
convert [] to a List) or an OrderedMap, because when Elmy sees a List or OrderedMap it will map through the, otherwise
we'd just get a single DeletableCounter.

Now let's make it add new counters when we click "add new". We already have our accessor, so we could do something like...

```js
<button onClick={e => counter(counters => counters.push(DeletableCounter.model))}>Add new</button>
```

But wait, there's two problems with this. First, it's too verbose, so let's extract it into a separate function:

```js
let pushDeletableCounter = counters => counters.push(DeletableCounter.model)
```

Better. But there's still another problem. Notice we're trying to push DeletableCounter.model, but DeletableCounter has no
model! We did not define it, because we wanted the default state of the Counter. Even if it existed, how do we know it
 includes the states of the children defined in _adopt_? That's exactly why _buildState_ exist. It's an utility function
 that computes the state of a model based on its initial state and the state of its children. Import it from "elmy/lib/buildModel"

```js
import buildModel from "elmy/lib/buildModel";
let pushDeletableCounter = counters => counters.push(buildModel(DeletableCounter.model))
```

and then

```js
<button onClick={e => counters(pushDeletableCounter)}>Add new</button>
```

But there's actually a function that does just that, it's called _push_ and you can import it from "elmy/lib/push".
It takes a model and returns a function that takes List and pushes the built model into the list. Why didn't I tell you
 this in the first place? So that you understand how building models works ;) Anyway:

```js
import push from "elmy/lib/push";
let pushDeletableCounter = push(DeletableCounter);
```

and then

```js
<button onClick={e => counters(pushDeletableCounter)}>Add new</button>
```

Or even

```js
<button onClick={e => counters(push(DeletableCounter))}>Add new</button>
```

```js
var Counters = {
    model: fromJS({
        counters: []
    }),

    adopt: {
        counters: DeletableCounter
    },

    update: {
        counters: (state, nextState, index, action) => "delete" == action ? state.deleteIn(['counters', index]) : nextState()
    },

    view: ({counters}, {Counters}) => <div>
        {Counters()}
        <div>
            <button onClick={e => counters(push(DeletableCounter)}>Add new</button>
        </div>
    </div>
}
```