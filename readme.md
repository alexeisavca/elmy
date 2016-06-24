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
convert [] to a List) or an OrderedMap, because when Elmy sees a List or OrderedMap it will map through it, otherwise
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
 that computes the state of a module based on its initial state and the state of its children. Import it from "elmy/lib/buildModel"

```js
import buildModel from "elmy/lib/buildModel";
let pushDeletableCounter = counters => counters.push(buildModel(DeletableCounter))
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

Alright, so only one last thing remains, deleting the counters. We are already sending a "delete" action from DeletableCounter,
but no one receives it. In fact, if you open the console you can see the message telling you there's no handler for this
action. So, what exactly _are_ actions? Well, they're just arrays. Invoking _send("foo", "bar", 123)_ will create a
["foo", "bar", 123] "action" aka array. But we need those to be arrays, because when an action travels up a hierarchy,
 there's something interesting happening. Suppose you have an app like this:

```js
let C = {view(){/*...*/}}
let B = {adopt{ c: C}}
let A = {adopt{ b: B}}
```

When the module C sends an action ["foo", "bar"], it's sent to the module A, but it's modified so that you can track its
travel path. So module A will receive ['b', 'c', 'foo', 'bar']. If module A is not interested in this action, or it allows
it to travel deeper down the hierarchy, next, module B will receive an action ['c', 'foo', 'bar']. And if module B is not
interested or it decides to invoke C's update, C will receive just ['foo', 'bar'], exactly what it sent.

In fact, when we're calling an accessor with a value, we're actually sending actions. _fieldName(value)_ is in fact a
shorthand for _send("change", fieldName, value)_. In the current example, given a counter has the value of 0, and we
we click on the + button, first the Counters module gets the event ['counters', _index_, 'deletable', 'change', 'value', 1],
 where _index_ is the index of the sender inside the List, i.e. 0, 1, 2 etc. Next, since Counters is not interested in
 this action, ['deletable', 'change', 'value', 1] gets sent to DeletableCounter, and since it's not interested in this
 action, Counter receives the ['change', 'value', 1] action, but it's not interested either, in which case, Elmy looks
 at the action, sees that it's a "change", and updates the 'value' with 1. It's because "change" is a special action and
 Elmy knows how to process it, but in any other case in such a scenario you would receive a "could not find handler for action"
 error message.

Now that we have a general idea about actions, we may ask ourselves how does a module listen to an action. There are several
ways. One way is to define an update method on the module, like this:

```js
var Counters = {
    model: fromJS({
        counters: []
    }),

    adopt: {
        counters: DeletableCounter
    },

    update(model, nextState, ...path){
    },

    view: ({counters}, {Counters}) => <div>
        {Counters()}
        <div>
            <button onClick={e => counters(push(DeletableCounter)}>Add new</button>
        </div>
    </div>
}
```

The first argument is the current state of the module, the second argument is a function, that once invoked will compute
what the state would look like if the action wasn't intercepted, and the rest of the arguments are the components of the
action, so if we have a counter with value of 0 and we click +, Counters.update would be called with (state, nextState,
'counters', _index_, 'deletable', 'change', 'value', 1), DeletableCounter.update would be called with (state, nextState,
'deletable', 'change', 'value', 1) and finally Counter.update would've been called with (state, nextState, 'change', 'value', 1)

That nextState thing might sound a bit odd, so let's review an example. Suppose we have a validator module:

```js
var Validator = {
    model: fromJS({value: ""}),

    update(state, nextState, action, field, value){
        if("change" == action){
            /*perform some validation:*/
            if(!valid){
                return state;//something went wrong, so we return the current state,
                //the data will not be sent to children, and Elmy will not execute the field update
            } else if(kindaValid){
                return nextState().set('field', value);//all is okish, but the data received from children
                //(or from Elmy updating the model) needs some modification
            } else if(totallyValid){
                return nextState()//all is fine, nothing to do here, just follow the default procedure
            }
        }
    },

    view: ({value}) => <input value={value()} onChange={e => value(e.target.value)}/>
}
```

That update function is a bit ugly, but we mentioned another way to listen for an action. That other way is pattern matching,
it matches the fragments of the action, so if you're listening for a ['foo', 'bar'] action, you could write

```js
   {
        update: {
            foo: (state, nextState, ...rest)//rest == ['bar']
        }
   }
```

Obviously, this way you can match children actions, too. If you have a child "foo", which has a child "bar", which emits
an action "baz", this will let you match that particular case:

```js
    {
        update: {
            foo: {
                bar: {
                    baz: state => //something something
                }
            }
        }
    }
```

You can also use \_ as wildcard, so

```js
    {
        update: {
            foo: {
                _: state => //something something
            }
        }
    }
```
Will match any action sent from "foo" or from it's children.

Phew, glad we got that behind us, now that we know all that, let's finish our Counters module:

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

Whenever Counters routes an action from its children, it checks if it's delete, and if it is, it deletes the model
of the child that sent it, in any other case, it just bails and returns the next state.

You can see this example [here](https://github.com/alexeisavca/elmy/blob/gh-pages/examples/counters.jsx)
and check how it looks on the [examples](https://alexeisavca.github.io/elmy/) page.

## More examples

* TodoMVC. [Code](https://github.com/alexeisavca/todomvc-app-template/blob/gh-pages/index.jsx) [Demo](https://alexeisavca.github.io/todomvc-app-template/)

## Todo:
* computable models
* side effects
* inputs that bind to accessors
* Elmy mixin and superclass for React components
* Invoking actions right away on root module mount
* VirtualDOM support
* Support for immutable libraries other than Immutable.js
