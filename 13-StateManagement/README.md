# State management and Custom hooks

## Managing state with useState
We have seen the way to handle state in small-scale React and React Native apps: usually, one component is in charge of a piece of state, and it passes the relevant data to the child components that need it, through props. 

At the top level, one component (possibly the top component) will be in charge of all the application's state, and will pass relevant pieces of the state to the child components in charge of smaller parts of the application. These components will pass all or parts of their state to child components.

For instance, in the Flashcard application for project 1, we may have:
- The main `App` component in charge of the list of decks.
- A `SelectDeck` or `DeckList` component in charge of picking a deck.
- A `Deck` component in charge of a single deck.
- A `Card` component in charge of a single card.
- A `Front` component in charge of the front of the card.
- A `Back` component in charge of the back of the card.
- Components in charge of editing data, such as the name of the deck, that are in charge of a single attribute of an object (e.g., the deck's name).

When information needs to be passed back to parent components, we use callbacks, which we pass to child components as props. The child components can then collect the necessary information, and send it to a parent component by calling the callback. The parent component can then act on the information as it sees fit.

For instance, in the Flashcard application, we have several callbacks:
- `SelectDeck`, after knowing which deck was selected, transmits this information to the `App` component, using it's `onSelect` prop callback. `App` uses it to display a `Deck` component instead of a `SelectDeck` component.
- A `Deck` component can reorder or delete card in the deck, based on information collected by the `Card` component. The `Card` component uses its `onGuess` and `onDelete` props callbacks to notify the `Deck` component of the action it should take. - The `Card` component uses the `Front` and `Back` components to gather the information it will send to the `Deck` components. `Front` and `Back` also use callbacks that `Card` sends them as props.
- Similarly, the `Deck` component can add cards to a deck, based on information gathered by the `AddCard` component.
- The `Deck` component is in charge of reordering the cards, adding new cards, deleting cards. The `App` component does not need to be involved in that. However, for the card order information to persist, the `App` component needs to be involved. `App` passes a an `onBack` prop callback to `Deck`, that the `Deck` uses to save the information. 

For reference, see [the flashcard project solution](../../project1-flashy/Solution.js).
To read a bit more on setState for state management, see the React documentation on [Lifting State Up](https://reactjs.org/docs/lifting-state-up.html) and [Thinking in React](https://reactjs.org/docs/thinking-in-react.html) (particularly step 4).

## The problem with useState
At the scale that we have seen, this works well. However, when the app grows large in terms of state and components, this may not work as well. A particular with using only props and `useState` to handle state is the "chain of custody props" pattern:


```javascript
// DistantParent.js
<Component1 propForC1='hello' propForDistantChild='hi'/>

//Component1.js
<Component2  propForC2='...' propForDistantChild='hi'/>

//Component2.js
<Component3 propForC3='...' propForDistantChild='hi'/>

// Component3.js
<Component4 propForC4='well ...' propForC5propForDistantChild='hi'/>

// Component4.js
<Component5 propForC5='...I don''t care much for passing this other prop around' 
            propForDistantChild='hi'/>
// Component5.js
<View>
<Text>Finally!</Text>
<DistantChild propForDistantChild='hi'/>
</View>

// DistantChild.js
DistantChild = (props) => <Text>{props.propForChild}</Text>
```

In short, passing props through many child component can become very burdensome. Imagine if Component3, Component4, and Component5 all needed a prop from DistantParent. Imagine that there were also a DistantChild2, a DistantChild3, a DistantChild4, in different child components. The issues with this scheme are:

- It becomes very hard to reuse a component, if it needs to pass around many props needed for its subcomponents. 
- And it becomes hard to just use a component, if it always needs 10 props to be used correctly. 
- Forgetting to pass one of the props would (in standard javascript), not lead to a compile-time error, but rather to a run-time bug that may be hard to track down. You've all already been there, with simpler state and less props.
- Passing props meant for another component as an "unused" argument increases the risk that the prop will be misused by another component along the way.

In the flashcard app, we didn't have this issue for two reasons:
- The state and the number of components were still small.
- The data was structured hierarchically. The data needed for the sub-components was always a subset of the data needed by the parent components.

However, this is not always the case.

Note that at first glance, a possible solution is to use the "object spread" operator:
```javascript
// DistantParent.js
<Component1 propForC1='hello' propForChild='hi'/>

// Component1.js
<Component2 propForC2="what" {...props} />

// Component2.js
<Component3 propForC3="is that" {...props}/>

// Component3.js
<Component4 propForC4="other prop"{...props}/>

// Component4.js
<Component5 propForC4="next to me?" {...props}/>


// Component5.js
<View>
<Text>Don't worry, it's not for you</Text>
<DistantChild {...props}/>
</View>

// DistantChild.js
DistantChild = (props) => <Text>{props.propForChild}</Text>
```

This way, all the props are automatically passed to the children components. While this works, it does not solve the issue:
- The props are now implicitely passed to the components, which makes it harder to reason about the code. It gets very hard to know which prop is used by which component by reading the code.
- All the props are passed to all the subcomponents, instead of passing the props meant to the components. So the components are sharing even more data with each other.
- The risk of a prop being misused along the way increases, as even more data is shared.
- If any component "forgets" to pass down all the props, we are back to square one:

```javascript
//Component2.js
<Component3 myProp={justMe} />

...

//DistantChild.js
DistantChild = (props) => <Text>{props.propForChild}</Text>

// Programmer:
<Scream despair={true}>WHY IS THIS TEXT EMPTY?</Scream>
```

So, while state management with useState works at small scales, for larger applications, other solutions are needed. 

A special use case are props that are needed for all components, such as common style information (or UI themes), or localization resources (language translations). Passing them to each and every component can become cumbersome.

## Don't stop using useState

Before going into state management, note that these state management solutions are not meant to bypass state management with React. This still works at small scales, and passing data as props is the best way to write simple and reusable components. 

As we will see, a good way to use these solutions is to use them in a similar manner than when we used navigation:  
- Define most of the UI with "Regular React Components" (also called "Dumb"), that receive data through props.
- Define **a few** adapter components, that will have the knowledge of the state management library (the "Smart" components). 

With navigation, we would define normal UI components, and wrap them with `Screen` components, that were in charge of hiding the navigation library from the other components. The `Screen` components would
- Get the data sent to a screen via parameters, and pass it as regular props to the components.
- Hide the usage of navigation operation (`navigation.navigate`), by wrapping it in a callback, also sent as a regular prop to a component. Usually, a component would be sent an initial callback (`callbackA`) to send data to the parent component. The Screen would receive it, and would define a callback that would to the original operation, and also navigate. 

The end result would look like this:
```typescript

const ScreenComponent = ({navigation, route}) =>  {

    const componentData = route.params.data
    const callbackA = route.params.callbackA

    const callbackB = newData => {
        callbackA(newData)
        navigation.navigate("Where to go")
    }
    return <Component data={componentData} callBackA={callbackB}/>
}
```

The goal is to achieve something similar, but for state in general.

### Component composition and render props

Some of the cases when a lot of props are passed around can be resolved by component composition, in particular with the pattern of **render props**. Render props are React components that are passed as props to other components. Essentially, a component will have a "hole", and accept as props another component to fill the "hole".

See some examples [in the React Documentation](https://reactjs.org/docs/composition-vs-inheritance.html). There is also a discussion of a special case of this, [headless UI components](https://medium.com/merrickchristensen/headless-user-interface-components-565b0c0f2e18).

In the `DistantChild` example, we could for example, instead of passing several props to a `DistantChild` component indirectly, pass the `DistantChild` component itself as a prop, in order to reduce the number of props passed around.

```javascript
//Distant Parent.js

const distantChild = <DistantChild prop1={...} prop2={...} prop3={} />
return <Component1 distant={distantChild}>
```

# The React State Museum
Several libraries have been defined to handle state management in React apps.

- The good news: there are plenty!
- The bad news: there are plenty! 

To compare them, someone made a "React State Museum", where various state management libraries are used to build the same app. The "React State Museum" uses the strategy highlighted above for navigation, to add state management without changing the initial component. All the state management is implemented in "Smart" components that wrap the "Regular" components. The "Smart" component get data and callbacks from the state management library, and pass it as props to the "Regular" components.

The React State Museum [can be found here](https://github.com/GantMan/ReactStateMuseum).
It implements the same app in with more than 30 (!!) state management libraries. The app is a simple packing app, in which two components communicate: one to add items to a list (or to clear the list), and another to display the list of items. The app is written for both React and React Native.

The app looks like this in React: 

<img src="https://github.com/GantMan/ReactStateMuseum/blob/master/_art/museumWeb.gif?raw=true"/>

And it looks like this in React Native:

<img src="https://github.com/GantMan/ReactStateMuseum/blob/master/_art/museum.gif?raw=true" />

We won't look at all 30+ libraries. We will look at a handful of the most well-known state management alternatives:
- React Context API
- Redux
- Mobx and Mobx-State-Tree
- Unstated

However, you are free to explore the state management libraries, and compare them on the application in question. By using a single application, it is much easier to compare the state management libraries.

## Baseline: the packing list app with setState

The baseline allows us to understand how the app works normally. In this case, we have three components:
- `App`: the top component of the application, that passes props to the other components.
- `ListItems`: a components that takes as props `allItems`, a list of items to display.
- `AddItems`: a component that allows to add items to the state. 

`AddItems` takes several props:

- `addItem`: a callback to add a new item to the state, with the name being set earlier by `setNewItemText`.
- `clear`: a callback to clear the list of items.
 
We don't need to know how the `ListItems` and `AddItems` components are implemented. The goal is to reuse them, without changing them. So the only thing that is needed is to pass the appropriate props to them.

The App component can be implemented in React Native as such:

```javascript

export default function App() {
  const [allItems, setItems] = useState(['nachos', 'burritos', 'hot dog']);
  const clear = () => setItems([]);
  const addItem = (item) => setItems([item, ...allItems])

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always">
        <Text style={styles.welcome}>Welcome to useState</Text>
        <AddItems
          addItem={addItem}
          clear={clear}
        />
        <ListItems allItems={allItems} />
      </ScrollView>
    </SafeAreaView>
  );
}
```

The state contains the list of items, `allItems` and the potential name of an item to be added to the list, `newItemName`. This state can be used as the state for a TextInput with controlled input. 

When a new item is added, it is appended to `allItems`, and the `newItemName` property is reset to the original property.


[See the app for React on CodeSandbox.io](https://codesandbox.io/s/github/GantMan/ReactStateMuseum/tree/master/React/setState)


## React Context

The React Context API is an API to handle state provided by the standard React API. You can find more documentation at: 
[React Context Documentation](https://reactjs.org/docs/context.html)

It is a relatively simple API whose only goal is to avoid passing as props parts of the state, particularly "global" data such as themes, localization, global user status, etc. Other state management libraries such as Redux have much more functionality.

React Context uses the concepts of a Context **Provider** and a Context **Consumer**.
- The Context **Provider** sets the state that is to be shared with other components.
- A Context **Consumer** can ask for the context, and fetch data from it. React will look for the closest Context defined in the tree of component, and hand it in to the consumer. 

The context does not need to be defined as a prop. Instead, the context provider will wrap the children components, allowing all children, even indirect one, to access the context if they ask for it. 




The top App component would look like this

```typescript
// other imports
import AppContext from "./src/context/AppContext";

export default function App() {
  const [items, setItems] = useState(["Pizza", "Falafel", "Sushi"]);

  const handleAddItem = (item) => {
    setItems([...items, item]);
  };

  const handleClearItems = () => {
    setItems([]);
  };

  return (
    <AppContext.Provider
      value={{
        addItem: handleAddItem,
        clearItems: handleClearItems,
        items,
      }}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.headline}>Welcome to React Native useContext!</Text>
        <ItemsController />
        <ItemsList />
        <StatusBar style="auto" />
      </SafeAreaView>
    </AppContext.Provider>
  );
}
```

Notice that everything is put in the state: that includes the callback function to mutate the state, that are passed in the state object itself. On the other hand, with context, nothing is passed as props anymore. Instead, the top component is wrapped in a higher-level component, the Context Provider component. To get the context, the context will use **a second hook**, the **useContext hook**, to get the context data. Where does the data come from? It seems "magic". It comes from the context provider that is defined the closest in the component tree. React will look it up at runtime, and pass it to the context consumer. This allows several context provider to exist in the same tree of components, each feeding different values to different parts of the tree.

Thus, the wrapping component takes the state, destructures it, and selects the props relevant to that specific child component. The `ItemsController` component would look like this:

```javascript
import React, { useContext, useState } from "react";
import { AddPackingItem } from "packlist-components/native";
import AppContext from "../context/AppContext";

const ItemsController = () => {
  const { addItem, clearItems } = useContext(AppContext);

  const [newItemName, setNewItemName] = useState("");

  const handleAddItem = () => {
    addItem(newItemName);
    setNewItemName("");
  };

  return (
    <AddPackingItem
      addItem={handleAddItem}
      clear={clearItems}
      setNewItemText={(input) => setNewItemName(input)}
      value={newItemName}
    />
  );
};

export default ItemsController;
```


When defined, the context provider can also provide default values. These are useful if there are consumers that are not children (directly or not) of any context provider. They will get the "default values", so that the component works (somewhat) even if no context is provided. The context provider is defined like so:

```typescript
import { createContext } from "react";

export const AppContext = createContext({
  addItem: (items) => {}, //addItem here is not fully functional
  clearItems: () => {},
  items: ["default", "item", "values"],
});

```

See the [full code of the Packing App with Context](https://github.com/GantMan/ReactStateMuseum/tree/master/ReactNative/useContext).


# Reusable hooks and Proper typing of the Context

There are still a few issues with the code above. 

- The app itself defines how the context works in terms of state, which is not ideal for reusability
- The default context misses this state, and is not fully functional
- We haven't seen how this works with TypeScript yet.

To solve the first two, we need to abstract away the state management in the context, rather than in the app component. This is actually very easy to do: we can simply extract the relevant code in a **custom hook**. 


## Custom hooks

While single hooks are convienent, one of the most important strengths of hooks is how much they facilitate reuse through **custom hooks**. The [full documentation on this is available here](https://reactjs.org/docs/hooks-custom.html). The gist of it is that a custom hook is a function that uses hooks (such as state hooks), but unlike a component, does not render anything. Defining a custom hook can be as simple as moving the relevant code to a new function (starting with `use` for conventions), and call it in the component. Let's define a custom hook to reuse the logic of a counter.

We had an earlier counter example:
```javascript
const Counter = (props) => {
    const [count, setCount] = useState(0)
    increment = () => setCount(count + 1)
    decrement = () => setCount(count - 1)

    return (
        <View>
            <Text>{count}</Text>
            <Button title="++" onPress={increment}/>
            <Button title="--" onPress={decrement}/>
        </View>
        )
}
```

Which we can reuse by extracting a `useCounter` hook:

```javascript
const useCounter = (initialValue, increment = 1) => {
    const [count, setCount] = useState(initialValue)
    increment = () => setCount(count + increment)
    decrement = () => setCount(count - increment)
    return [count, increment, decrement]
}
```

Which simplifies the implementation of the counter:

```javascript
const Counter = (props) => {
    const [count, increment, decrement] = useCounter(0)

    return (
        <View>
            <Text>{count}</Text>
            <Button title="++" onPress={increment}/>
            <Button title="--" onPress={decrement}/>
        </View>
        )
}
```

And allows to reuse the logic in other components:

```typescript 
const BigOnlyUpCounter = (props) => {
    const [count, increment, ...] = useCounter(0, 5) // decrement not needed

    return (
        <View>
            <Text style={/*big font size*/}>{count}</Text>
            <Button title="++" onPress={increment}/>
        </View>
        )
}
```

## Custom hooks to manage the context

We can extract the implementation of the context out of the main App component, in a reusable hook:

```typescript
// other imports
import AppContext from "./src/context/AppContext";


const useAppContext = (initialValues) => {
    const [items, setItems] = useState(initialValues);

    const handleAddItem = (item) => {
        setItems([...items, item]);
    };

    const handleClearItems = () => {
        setItems([]);
    };

    // we return an object with the properties matching the context format
    return {
        addItem: handleAddItem,
        clearItems: handleClearItems,
        items,
      }

}

export default function App() {
    const context = useAppContext(["Pizza", "Falafel", "Sushi"])

  return (
    <AppContext.Provider
      value={context}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.headline}>Welcome to React Native useContext!</Text>
        <ItemsController />
        <ItemsList />
        <StatusBar style="auto" />
      </SafeAreaView>
    </AppContext.Provider>
  );
}
```

## Adding typescript

We can even put the custom hook together with the context definition, and properly type it too
```typescript
import { createContext, useState } from "react";

type AppContext = {
  addItem: (string) => void; // callback to add an item
  clearItems: () => void; // callback to clear all items
  items: string[]; // format of the data structure
}

// the reusable hook returns an object of the type of the context
const useAppContext = (initialValues): AppContext => {
    const [items, setItems] = useState();

    const handleAddItem = (item) => {
        setItems([...items, item]);
    };

    const handleClearItems = () => {
        setItems([]);
    };

    // we return an object with the properties matching the context format
    return {
        addItem: handleAddItem,
        clearItems: handleClearItems,
        items,
      }

}

// the default app context is now fully functional, and type checked
export const DefaultAppContext = createContext<AppContext>(useAppContext(["default", "item", "values"]));

// the app can also create a new context with other values, using the hook, as before.

```

## Integrating contexts and navigation

See the example live-coded in class



# Other state management options
There are a variety of other state management options. Some others are described below:

## Unstated

Unstated one of the simplest state solution, which also has the big advantage of being very consistent with the way React works. See [Packing app with Unstated here](https://codesandbox.io/s/github/GantMan/ReactStateMuseum/tree/master/React/unstated)

Unstated is built on top of the Context API, and it uses a provider setup like the Context API. The Provider wraps around React components. 

```javascript
import React from "react";
import { Provider } from "unstated";
import ListItems from "./Components/listItems";
import AddItems from "./Components/addItem";

const App = props => (
      <Provider>
          <AddItems />
          <ListItems />
      </Provider>
    )
```

A difference is that the Provider is defined separately to the component. The Provider uses the same API as a React component would: state, and a setState method.  These state containers are essentially React components, but they do not have any view associated with them. For the packing list, this looks like this:

```javascript
import { Container } from "unstated";

export default class ListContainer extends Container {
  state = {
    allItems: ["nachos", "burritos", "hot dog"],
    newItemName: ""
  };

  addItem = () => {
    this.setState(state => ({
      allItems: [...state.allItems, state.newItemName],
      newItemName: ""
    }));
  };

  setNewItemName = event => {
    this.setState({ newItemName: event.target.value });
  };

  clear = () => {
    this.setState({ allItems: [] });
  };
}
```

Then, child components can be wrapped in Subscribers, and are passed state **containers** as props: 

```javascript
import React from "react";
import { AddPackingItem } from "packlist-components";
import ListContainer from "../Unstated/listContainer";
import { Subscribe } from "unstated";

const AddItems = props =>(
      <Subscribe to={[ListContainer]}>
        {list => (
          <AddPackingItem
            addItem={list.addItem}
            setNewItemText={list.setNewItemName}
            value={list.state.newItemName}
            clear={list.clear}
          />
        )}
      </Subscribe>
    )
```

The container will then be able to notify the child components of any state change, as a regular React component would. This solution is really the simplest one, and the most consistent with how React work (even more than the Container API). It does, however, miss some more advanced features that Redux, or Mobx-State-Tree can use, such as out of the box support for Middleware or Time Travel.

While Unstated is consistent with how React work, there is a slight difference: Unstated's setState is `async`, which means that it can be `await`ed, in case sequences of setStates with dependencies need to be done (note that these usually indicate that the components are too complex and may need to be broken up).


## Redux

See the [full redux code of packing app](https://codesandbox.io/s/github/GantMan/ReactStateMuseum/tree/master/React/redux)

Redux is one of the most popular state management libraries. Like all the following solutions, it  is a 3rd party library that needs to be installed separately.

Like Context, Redux also has the concept of Provider that wraps around the application. But there is no state management at the top level, so there is no props passed down to the components for the state. Instead, Redux defines a "global state", independently of the components. The global state is called the redux **store**. 

```javascript
import { Provider } from "react-redux";
import configureStore from "./Redux/Store/configureStore";
let store = configureStore();

const App = props => (
      <Provider store={store}>
          <AddItems />
          <ListItems />
      </Provider>
    )

export default App
```

How does a component know which data to get, and when it should update? With Redux, you can define a "mapStateToProps" function, that selects the relevant parts of the state for a given component. 

mapStateToProps is a function that takes the redux store (the global state), and returns an object whose keys are the name of the props that the child component expects, and the values are the part of the state that is relevant to that component.

Then, there is a `connect` function that returns a higher-order component. This component has no props, but uses `mapStateToProps` to give props to its child component.

The advantage: like when using Context with a wrapper component, the original component just accepts props, as it did before. No change is needed. For instance, the `ListItems` component is a wrapper around the list component, using `mapStateToProps` and `connect`:

```javascript
import {SimpleList} from "packlist-components";
import { connect } from "react-redux";

const mapStateToProps = state => ({ value: state.items.myItems });

export default connect(mapStateToProps)(SimpleList);
```

Redux also uses the concept of dispatching operations to a store. There is a second argument to connect, called `mapDispatchToProps` that can "translate" the original callbacks that a component had to redux operations. Similarly, they just stay as props for the original component. For instance, the AddItems component would be defined like this:

```javascript
import { AddPackingItem } from "packlist-components";
import { ItemActionCreators } from "../Redux/Actions/items";
import { connect } from "react-redux";

const mapStateToProps = state => ({ value: state.items.newItemName });

const { setNewItemName, addItem, clear } = ItemActionCreators;

const mapDispatchToProps = {
  setNewItemText: e => setNewItemName(e.target.value),
  addItem,
  clear
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPackingItem);

```

### Actions and Reducers 

Then, Redux uses the concept of **actions** to affect the store.  The actions need to be defined, and in a second part they should be "interpreted" by a **reducer**. Each action should take the previous version of the store, and produce a new version of the store (with pure functions). 

Do you remember the higher-order function called [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)? It takes a list of elements, a function, and an initial value, and applies the function to every element of the list, accumulating the result, starting with the initial value.

```javascript
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

This is where the names **reducer** and **Redux** come from. Similarly, a reducer takes a list of actions, and an initial Redux store, to produce the current of the application.

```javascript

const actions = [ADD_ITEM, ADD_ITEM, RENAME_ITEM, ADD_ITEM, REMOVE_ITEM]
const reducer = (store, action) => dispatch(store, action)

reducer(emptyStore, actions)
```

This allows Redux to have "time travel", i.e., to store all the actions affecting the store as the application executes for debugging purposes. The store can then be produced at any point in time, by dispatching all or parts of the list.

First, the actions need to be defined. For the packing list app, this would be:

```javascript
export const ItemsActions = {
  ADD_ITEM: "ADD_ITEM",
  CLEAR: "CLEAR",
  SET_NEW_ITEM_NAME: "SET_NEW_ITEM_NAME"
};

// Action creators store.dispatch actions
export const ItemActionCreators = {
  addItem: () => ({type: ItemsActions.ADD_ITEM})

  clear: () => ({type: ItemsActions.CLEAR})
    
  setNewItemName: value =>  ({type: ItemsActions.SET_NEW_ITEM_NAME, value: value})
};
```

Then we need to define the reducers: the functions that, given an action, produce a new version of the store.

```javascript
import { ItemsActions } from "../Actions/items";
import { combineReducers } from "redux";

// shape is an empty array
const INITIAL_STATE = {
  myItems: ["nacho", "burrito", "hotdog"],
  newItemName: ""
};

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ItemsActions.ADD_ITEM:
      return {
        ...state,
        myItems: [...state.myItems, state.newItemName],
        newItemName: ""
      };
    case ItemsActions.CLEAR:
      return {
        ...state,
        myItems: []
      };
    case ItemsActions.SET_NEW_ITEM_NAME:
      return {
        ...state,
        newItemName: action.value
      };
    default:
      return state;
  }
}

// just one reducer here, but we can define several
export default combineReducers({[reducer]});
```

The store would be created based on the reducers:

```javascript
import { createStore } from "redux";
import RootReducer from "../Reducers/";

const baseStore = createStore(RootReducer);
export default initialState => {
  return baseStore;
};
```

### Middleware
Redux also supports **middleware**: a layer of operations that can be inserted during state management. This allows for instance to transparently support logging, or client-server communication, by adding a middleware for this kind of operation. 

Applying a middleware that logs all actions would look like this:

```javascript
import { createStore, applyMiddleware } from "redux";
import RootReducer from "../Reducers/";

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}


let middleware = [logger];

const baseStore = createStore(RootReducer, applyMiddleware(...middleware));
export default initialState => {
  return baseStore;
};
```

There is much more on middleware [here](https://redux.js.org/advanced/middleware)
The documentation of Redux in general is available [here](https://redux.js.org)

### Downsides of Redux
The downsides of Redux are:
- A steep learning curve, with lots of new concepts.
- It needs a lot of boilerplate. 

Regarding boilerplate, it is common that adding a new features involves changing several files at once: the file where the store is defined, the one where the actions are defined, the one where the reducers are defined, as well as the components themselves. For the specific case of writing the reducers, it can be made a bit less painful by using [Immer](https://github.com/immerjs/immer), as shown [here](https://dev.to/mercatante/simplify-your-redux-reducers-with-immer-3e51).


## MobX

See [Packing app in Mobx here](https://codesandbox.io/s/github/GantMan/ReactStateMuseum/tree/master/React/mobx). Mobx is a state management solution that, unlike Redux, allows for a concise definition of the state management.

With Mobx, a store is defined separately, as in Redux. MobX has no provider components, unlike the previous alternatives to setState. In the packing app, the top component would look like this:

```javascript
const App = () => (
      <View>
        <AddItems />
        <ListItems />
      </View>
    )  
```

### Accessing the data, and observers

The child Components can access the store directly and pick the state that they need to pass as props to the UI components. As always, it is still highly recommended to use "wrapper" components to not pass the Mobx store directly to the UI components. For the `AddItems` component, this looks like this:

```javascript
import React from "react";
import { AddPackingItem } from "packlist-components";
import ListStore from "../Mobx/listStore";
import { observer } from "mobx-react";

@observer
export default class AddItems extends React.Component {
  render() {
    return (
      <AddPackingItem
        addItem={ListStore.addItem}
        setNewItemText={ListStore.setNewItemName}
        value={ListStore.newItemName}
        clear={ListStore.clear}
      />
    );
  }
}
```

Notice the `@observer` special syntax. MobX uses the decorator and observer patterns. An observer gets notified when the objects that it observes changes (the data store). The decorator allows to implement the observer as seamlessly as possible, by wrapping the original component in a higher-order component.

It is similar to `connect`, with the addition that the observer allows you to only re-render the components that change. In order to implement a similar functionality in Redux, more advanced functionality (reselect) is needed. 

### The Mobx Store

The store is defined as a simple javascript class, in which the state can be modified imperatively. The store defines which of the values in it are observable, and the operations to modify the store. 

```javascript
import { observable } from "mobx";

class ObservableListStore {
  @observable allItems = ["nacho", "burrito", "hotdog"];
  @observable newItemName = "";

  addItem = () => {
    this.allItems.push(this.newItemName);
    this.newItemName = "";
  };

  clear = () => {
    this.allItems = [];
  };

  setNewItemName = e => {
    this.newItemName = e.target.value;
  };
}

const observableListStore = new ObservableListStore();
export default observableListStore;
```

Notice how this is much more concise than Redux! It is so concise that it looks magic (and it is, in a way).

### Pros, Cons and Mobx-state-tree

Mobx is very simple to add to a code base, and in addition can be quite efficient, as the observer mechanism updates only components that have parts of the data that changed. This is more efficient and precise than relying on React's state diffing.

On the other hand, the "observer magic" can be "too magic" for some people. Since Mobx is much more open-ended into how it should be used and how the store can be defined, it is harder to integrate middleware with it, and it is harder to have a state tree history like Redux has. Both functionalities require some assumptions on how the store is structured, that might not always be true with Mobx.

There is, however, and additional component on top of Mobx, that solves these two issues of middleward and state history by imposing more constraints on the store. This is [Mobx-State-Tree](https://codesandbox.io/s/github/GantMan/ReactStateMuseum/tree/master/React/mobx-state-tree), or MST.

With MST, it becomes a bit more work to add a store to an existing application, but this can pay off. For instance, there are two callbacks `onSnapshot` and `onPatch` that can be executed any time the state changes, and that allow to record history, similarly to Redux Time Travel. This also allows MST to support middleware, such as [these examples](https://github.com/mobxjs/mobx-state-tree/blob/master/packages/mst-middlewares/README.md).


# Summary

The simplest option to use is Unstated, as it is the most consistent with how React work. Mobx and Mobx-State-Tree are of intermediate complexity, while Redux has the most learning curve, and the most "boilerplate". Both MST and Redux have some additional, valuable functionality: Time-Travel and middleware. 
