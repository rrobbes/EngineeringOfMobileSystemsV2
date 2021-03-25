# State and Callbacks

While functional programming, which avoids mutable state and unpredictable functions is very useful to avoid bugs, it can not be easily used by itself in all contexts. To make interesting applications, we need some form of input/output (such as user interaction), and a concept of state. We just need to integrate this in a disciplined way to avoid problems. The way to do this in React Native is to handle input/output through callbacks, and to handle state via re-rendering and the useState hook.

## Back to the counter
Let's go back to the counter example from the introduction.

```typescript
const Counter = () => {
   const [count, setCount] = useState<number>(0)

   const increment = () => setCount(count + 1)
   const decrement = () => setCount(count - 1)
   return (
     <View>
       <Text>count is: {count}</Text>
       <Button title="++" onPress={increment}/>
       <Button title="--" onPress={decrement}/>
</View> )}
```

This is a counter that keeps track of a value over time, and allows the user to change it with the help of two buttons. To keep track of a value changing over time, we need a concept of state. To allow users to interact with the component, we need a way to collect their input. 

## Callbacks

React Native contains a variety of UI components that can be used to allow for user interaction. The simplest of this is the `Button`, but a variety of others exist: any component can be converted in a `Pressable`, boolean values can be toggled with a `Switch`, text can be entered with a `TextInput` to name a few. Gestures or presses in specific locations are also supported by more advanced APIs. All of these components function in the same way:
- They have specific props, **event handlers**, that specify what to do when an event happens. For a `Button`, this is the `onPress` prop.
- The UI components are displayed by React Native's native thread. When the user interacts with it, a message is sent back to the JS thread.
- The JS thread, upon receiving the message, executes the **callback** specified as prop to the component.
- After executing a callback, React Native takes note of changes to state and props, and re-renders the UI.

Each callback is a function, passed as an argument. Each component expects a particular kind of function to work properly. For instance:
- A button expects a function that does not necessarily needs an argument, as for the most common use case we just need to know the button was pressed.
- A switch expects a function that needs an argument, which would be the (boolean) value the switch took (enabled or disabled). The callback is passed to the `onValueChange` event handler prop.
- A text input also expects a function that needs an argument, which would be the value of the text in the textinput component. The callback is passed to the `onChangeText` event handler prop.

Note that, depending on the event handler, these function may actually be able to receive more arguments for more advanced use cases. For instance, the `onPress` prop for the Button may take an additional argument, to access the event's data (such as screen coordinates of the location of the press). In addition, these components support a variety of additional events. For instance, the TextInput has event handlers for when it is focused, or for when text is selected inside it. Do consult the documentation for this!

For our button, we have two such callbacks, which we defined as the functions `increment` and `decrement`, both taking no arguments as expected for the basic use case of button event handlers. We could also have defined them as anonymous functions.

## State 

React uses a very specific concept of state. Each component can have state associated with it, and the component **can** change its state. However this must be done in a disciplined way:

- State can not be changed when the component is rendered, only via callbacks that will be executed after the UI is rendered. The state is always **constant** while rendering.
- State can not be changed directly. It must be changed using React's API, in particular with the `useState` hook. This allows React to detect state changes.
- State is changed in a "functional" way: the old state is entirely replaced by the new state, rather than mutating the old state. This means that the original state must be copied (here the `...` spread operator for objects and lists comes handy), with the pieces that need to be changed replaced by the new version.

Whenever, in response to a callback, the state of a component changes, the component whose state have changed are re-rendered, as well as any components for which props would change as a result of the change in state. This simplifies how we think about the UI, as we can think of it as a "function of the data".

For our counter, this is simple: 
- Whenever our `increment` callback is called, we change the state of the component, incrementing the `count` value by one.
- Whenever our `decrement` callback is called, we substract one from the count.

If any of these callbacks are executed, then the count state changes, which causes the component to be re-rendered.

## Hooks and the useState hook

A component that is a pure function can not have state. Older versions of React used class components to handle state. This is still possible, but newer versions of React allow function components to have state, which ends up being simpler. 

A function component, by default, does not have any data that survives it's execution, as it is entirely specified by its parameters or props. To allow these components to reference data that spans more than one render, React introduced the hook mechanism. We will only see the `useState` hook today, but others exist, and you can (very easily!) define your own custom hooks.

## How do hooks work
You can think of hooks as a "magic feature" that "just works". However it's important to have an intuition of how they work. In a version of React that supports hooks, every component is associated with a data structure outside of the components. This data structure is essentially a list of all of the information that the hooks defined in that function use.

When a hook is invoked during the rendering of a react component, this information is fetched from that data structure, and returned to that component. This is what allows the component to maintain state and a lifecycle while still being a functional components (see more information [here](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e) ). For this model to work, there are only **three rules** that needs to be followed.



## The rules of hooks
The rules that need to be followed are:
- **Don't call hooks inside conditionals or loops**. For performance reasons, React relies on the hooks being called **in the same order** accross each re-renders (they are in a sort of queue). 
- **Only call hooks from React components, or custom hooks**. Hooks are attached to a component, so they must be called from inside a component, directly or indirectly. Do not call hooks from regular javascript functions.
- **hook names should start with `use`**. This is more of a convention, but if you define a custom hook, prefix its name with `use`, so that developers (and the IDE) can recognize it's a hook. This allows the IDE to check if the other rules are followed. Avoid this prefix for other function names.

The first rule deserves more explanation:
```javascript
const BuggyMultiCounter = (props) => {
    // display the first counter, which can be increased 
    if (props.first) {
        const [count, setCount] = useState<number>(1)
        increment = () => setCount(count + 1)
        return (
            <View>
                <Text>{count}</Text>
                <Button title="++" onPress={increment}/>
            </View>
        )
    } else {
        // display the second counter, which can be decreased 
        const [count2, setCount2] = useState<number>(2)
        decrement2 = () => setCount2(count2 - 1)
        return (
            <View>
                <Text>{count2}</Text>
                <Button title="--" onPress={decrement2}/>
            </View>
        )
    }
}
```

You can see that depending on the value of the prop, different hooks will be called, which will result in bugs.
The solution is to always call all the hooks in the same order, like in the following:

```javascript
const MultiCounter = (props) => {
    // get state of first counter
    const [count, setCount] = useState<number>(1)
    increment = () => setCount(count + 1)
       
    // get state of second counter
    const [count2, setCount2] = useState<number>(2)
    decrement2 = () => setCount2(count2 - 1)
       
    // conditionally render the first or the second
    return props.first?
        (<View>
                <Text>{count}</Text>
                <Button title="++" onPress={increment}>
            </View>):
        (<View>
                <Text>{count2}</Text>
                <Button title="--" onPress={decrement2}>
            </View>)
}
```

See more [here](https://reactjs.org/docs/hooks-rules.html)



## defining state with useState 

The first hook is `useState`, that we saw above. `useState` allows us to attach state to a function component, by declaring a state variable. The `useState` hook is invoked with one argument, which is the initial value of the state. The first call of `useState` to useState will initialize the variable. `useState` returns an array of two objects, which are:
- The **current value of the state**. This will be a new state variable, initialized to the argument to `useState`, the first time the component is rendered. On subsequent calls, the current value will be fetched and returned.
- A **function to change the state**. This function sets the state variable to a new value, **just as setState would do**. After changing the state, the **component will be re-rendered**, just as if setState was called. Just like setState, we can use it in callbacks, etc ...

 We can use the destructuring assignment to get both objects at once, and name them as we'd like. By convention, one would be called `x`, and the other `setX`:

 ```javascript
 const Counter = ({init}:{init:number}) => {
    const [count, setCount] = useState<number>(init)

    return (
        <View>
            <Text>{count}</Text>
            <Button title="++" onPress={() => setCount(count + 1)}/>
            <Button title="--" onPress={() => setCount(count - 1)}/>
        </View>
        )
}
```

In that example, `setCount(count + 1)` would be exactly equivalent to `setState({count: this.state.count + 1})`. The advantage is that the `setCount` knows that it will be used to change the count property, so it can be less verbose. 

More than one setState can be used:
```javascript
const ThreeCounters = ({i1, i2, i3}:{i1:number, i2: number, i3: number}) => {
    const [c1, setC1] = useState<number>(i1)
    const [c2, setC2] = useState<number>(i2)
    const [c3, setC3] = useState<number>(i3)
    // ...
```

As long as the calling order is respected, things will work. Often, each state property would be defined as with a separate setState. You can define a `useState` that works on a full object or a list, but then you need to set the entire state. 

```javascript
const ComplexState = ({users}:{users:User[]}) => {
    const [current, setCurrent] = useState<User>(users[0])
    const [allUsers, setAllUsers] = useState<User[]>(users)
    const [countries, setCountries] = useState<string[]>([])
    // ...
```

On the other hand, `setCount` can also take a callback as its argument, which will be called with the current version of the state. This can be more robust in some situations than relying on the value of the state during render. It is also possible to pass a function for the initial state, if it is something more complex. Note that this function will only be called once, when the component is initialized.

```javascript
const Counter = () => {
   
    const [count, setCount] = useState<number>(() => Math.floor(Math.random() * 100))
    increment = () => setCount(c => c + 1)
```


See more on setState [here](https://reactjs.org/docs/hooks-state.html) and [here](https://reactjs.org/docs/hooks-reference.html#usestate) and a discussion on multiple versus single useState [here](https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).


## Conditional rendering based on state, and other UI elements

Once we have state, we can also use it for conditional rendering. For instance, we can define a boolean state, and render different things based on its value.

```typescript
const Counter = () => {
   const [count, setCount] = useState<number>(0)
   const [visible, setVisible] = useState<boolean>(true)

   const increment = () => setCount(count + 1)
   const decrement = () => setCount(count - 1)
   return (
     <View>
       {<Text>count is: {visible?
                            count:
                            "hidden! Try to guess it :-)"}</Text>
       <Button title="++" onPress={increment}/>
       <Button title="--" onPress={decrement}/>
       <Switch value={visible} onValueChange={bool => setVisible(bool)}>
    </View>
    )}
```

Other examples of conditional rendering could be to render a list of elements, but adjust the level of detail either by some settings, or based on the number of elements to render (show more details when less elements are visible). One could then filter the list of elements, for instance to show only the elements that match a text entered in a textInput.

```typescript
const UserList = ({users}:{users: User[]}) => {
  const [filterText, setFilterText] = useState<string>("")
  const selected:User[] = users.filter((u: User) => u.name.includes(filterText))
  const showDetails:boolean = selected.length < 10
  return (
   <View style={styles.container}>
    <TextInput value={filterText} 
               onChangeText={t => setFilterText(t)}
               style={{backgroundColor: "blue"}}/>
    {selected.map((u: User) => showDetails?
                                <DetailedUser user={u}/>:
                                <ShortUser user={u} />)}
   </View>
  )
}

// other components left as an exercise to the reader
```


