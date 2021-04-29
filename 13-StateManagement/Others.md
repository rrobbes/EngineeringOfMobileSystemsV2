# Other state management alternatives

## Unstated

Unstated is one of the simplest state solution, which also has the big advantage of being very consistent with the way React works. See [Packing app with Unstated here](https://codesandbox.io/s/github/GantMan/ReactStateMuseum/tree/master/React/unstated). Note that it relies on class components, not hooks. See ``unstated-next`` [on the main page](,.README.md).

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

**Note:** a new, streamlined API is available: [Redux toolkit](https://redux-toolkit.js.org)

**Note 2**: reducers are available separately as hooks, just to manage state, without the additional functionality of redux, See the (useReducer hook)[https://reactjs.org/docs/hooks-reference.html#usereducer].

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
