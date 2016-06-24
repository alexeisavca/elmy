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
Long story short, [Elm architecture](http://guide.elm-lang.org/architecture/index.html) means you have application
structured in modules, each module includes a model, a view, and an update function. The view is much like a React component,
it transform data into DOM, the model is the state of the view, much like a Flux store and the update function updates
the model depending on user actions.

### Counter
Let's start by implementing a counter application. It will have a button to increment it, a button to decrement it, and
it will display its current value. As in ELM, we'll structure our application into modules, and in our case a module is
just a plain Javascript module, but it must include _at least_ a _view_ function. So let's start with our view.

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
You can write your own, but I'll use mine from [Ftools](https://github.com/alexeisavca/ftools)

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