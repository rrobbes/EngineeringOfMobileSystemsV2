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
- Define most of the UI with "Regular React Components", that receive data through props.
- Define **a few** adapter components, that will have the knowledge of the state management library (or "Smart" components). 

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

## Baseline: the packing list app with useState

The baseline allows us to understand how the app works normally. In this case, we have three components:
- `App`: the top component of the application, that passes props to the other components.
- `ListItems`: a components that takes as props `allItems`, a list of items to display.
- `AddItems`: a component that allows to add items to the state. 

`AddItems` takes several props:

- `addItem`: a callback to add a new item to the state, with the name being set earlier by `setNewItemText`.
- `clear`: a callback to clear the list of items.

 
We don't need to know how the `ListItems` and `AddItems` components are implemented. The goal is to reuse them, without changing them. So the only thing that is needed is to pass the appropriate props to them (note that we are simplifying things a bit here, the actual implementation passes two more props, and has more layout components, etc. here we simplfy to make the presentation of the concepts clearer).

The App component can be implemented in React Native as such:

```javascript

export default function App() {
  const [allItems, setItems] = useState(['nachos', 'burritos', 'hot dog']);
  const clear = () => setItems([]);
  const addItem = (item) => setItems([item, ...allItems])

  return (
      <ScrollView>
        <Text>Packing list with useState</Text>
        <AddItems
          addItem={addItem}
          clear={clear}
        />
        <ListItems allItems={allItems} />
      </ScrollView>
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
      <ScrollView>
        <Text>Packing list with useContext</Text>
        <ItemsController />
        <ItemsList />
     <ScrollView>
    </AppContext.Provider>
  );
}
```

Notice that everything is put in the state: that includes the callback function to mutate the state, that are passed in the state object itself. On the other hand, with context, nothing is passed as props anymore. Instead, the top component is wrapped in a higher-level component, the Context Provider component. To get the context, the context will use **a second hook**, the **useContext hook**, to get the context data. Where does the data come from? It seems "magic". It comes from the context provider that is defined the closest in the component tree. React will look it up at runtime, and pass it to the context consumer. This allows several context provider to exist in the same tree of components, each feeding different values to different parts of the tree.

Thus, the wrapping component takes the state, destructures it, and selects the props relevant to that specific child component. The `ItemsController` component would look like this:

```javascript
import React, { useContext, useState } from "react";
import { AddItems } from "packlist-components/native";
import AppContext from "../context/AppContext";

const ItemsController = () => {
  const { addItem, clearItems } = useContext(AppContext);
  // original implementation adds an intermediate component and two more callbacks to handle a text field
  
  return (
    <AddItems
      addItem={handleAddItem}
      clear={clearItems}
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
- We haven't seen how this works with TypeScript yet.

To solve the first two, we need to abstract away the state management in the context, rather than in the app component. This is actually very easy to do: we can simply extract the relevant code in a **custom hook**. 


## Custom hooks

While single hooks are convienent, one of the most important strengths of hooks is how much they facilitate reuse through **custom hooks**. The [full documentation on this is available here](https://reactjs.org/docs/hooks-custom.html). The gist of it is that a custom hook is a function that uses hooks (such as state hooks), but unlike a component, does not render anything. Defining a custom hook can be as simple as moving the relevant code to a new function (starting with `use` for conventions), and call it in the component. Let's define a custom hook to reuse the logic of a counter.

We had an earlier counter example:
```typescript
const Counter = (props) => {
    const [count, setCount] = useState<number>(0)
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
    // the app create a new context with initial values.
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
    const [items, setItems] = useState<string[]>(initialValues);

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

// the app context can be type checked
export const DefaultAppContext = createContext<NumberContext>({
  addNumber: (n: number) => {},
  numbers: []
});

```

## Integrating contexts and navigation

Since the "Screen" components for navigation are at the top of the component hierarchy for each screen, and they have knowledge of the navigation, which already makes them "non-standard" components, they are a good place to also include context management. This allows to have a few components that know about both context and navigation, while other components do not know about any of these topics; they just receive props. It is then possible to add additional components that use context (**sparingly**) inside the hierarchy, if needed. Those uses should be as limited as possible. For instance, the following pair of components from [the number list application](https://snack.expo.io/@rrobbes/contextual-navigation).

```typescript
// screen component, knowing about both Navigation and Context
const AddNumberScreen = ({navigation, route}) => {
    // extracts callback to add numbers from the context
    const {addNumber} = useContext(AppContext)

    // wrap the context callback to additionally add navigation
    // to return back to the main screen
    const wrappedAdd = (n: number) => {
        addNumber(n); 
        navigation.navigate("NumList");
    }
    
    // passing data as props to regular component
    return <AddNumber onAdd={wrappedAdd} />
    
}

// regular component, that is oblivious to both the navigation and the context
const AddNumber = ({onAdd}:{onAdd: NumCallback}) => {

    const choices = [6, 7, 8, 9, 10]

    return (
       <View>
        {choices.map(n => <Button title={"add " + n} onPress={() => onAdd(n) } />)}
        </View>
    )
}

```

## Multiple contexts

### Multiple different contexts

It is perfectly possible to have multiple contexts. To do so, just add several context providers at the beginning of the application. Indeed, it is preferable to have multiple smaller contexts, used in fine-grained locations, rather than one large context shared by all components. For instance, you may have two contexts, ``ContextA`` and ``ContextB``, which some of your screens only using ``ContextA``, others only using ``ContextB``, others using possibly both (or none of them!).

```typescript
const App = () => {

  const contextA = useContextA(...)
  const contextB = useContextB(...)

  return (
      <ContextA.Provider value={contexA}>
        <ContextB.Provider value={contexB}>
          <StackNavigator />
        </ContextB.Provider>
      </ContextA.Provider>
  )
}
```

### Multiple instances of the same context 

This is possible. You can have several portions of the app that share the same type of context, but with different context values. Here is an example, based on the number list (it also shows how to use the number list components without navigation).

[See the example here](https://snack.expo.io/@rrobbes/multiple-contexts)

Notice how components (the bottom 2) can share the same context, being then updated together (but still maintain some state independently, such as for conditional rendering), and how other components evolve independently (the top component vs the bottom 2). 

# Other state management options
There are a variety of other state management options. Some others, namely Unstated, Redux and MobX, are described [in a second page](./Others.md). For the purpose of this class, they are not really necessary, but might be useful for you in the future. State management APIs such as Redux and MobX are significantly more powerful, allowing things such as logging of state changes, undoing changes to the state, or keeping some state on a centralized server, rather than just on the device.

One final note concerns (unstated-next)[https://github.com/jamiebuilds/unstated-next]. This is a very thin layer (30 lines of code!) on top of the useContext API, which makes it slightly easier to use. It is the updated version of unstated (see second page), for the versoin of react that uses hooks. 
