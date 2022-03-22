# React and React Native

The examples in the recorded lecture are [here](https://snack.expo.io/@rrobbes/rn-basics).

## The React Paradigm

As we mentioned in the introduction, React is:
- Composable
- Reusable
- Scalable
- Declarative
- Influenced by functional programming

When you work with a React application, you:

- Declare a tree of UI components based on the data you have
- Render the tree of UI components to show it to the users
- Wait for events (users or others), that are processed via callbacks (declared during rendering)
- If the data changes (due to the callbacks), the tree changes, and is re-rendered

In essence, **the entire UI is seen as a function of the data**. Then, the UI is shown to the user, allowing them to interact. Whenever the data changes due to the user's interaction, the entire UI is re-rendered, thus keeping the UI in sync with the data. Whenever there is a change in the data, the "UI-generating function" is called with new data (in practice, this is not strictly true since React optimizes it, which has a few consequences we will see later).

In this class, we will see how to render a tree of UI components with Components and JSX, while not focusing too much (yet) on how to change it. This will be the focus of the next class.

## JSX/TSX

JSX is a special syntax that React uses to render graphical components, inspired by its roots as a web framework, to make the components closer to the final HTML. TSX is the same, but for TypeScript. It is purely syntactic sugar, and can be not used, if desired. The two blocks below are equivalent; the first one will actually be compiled to a Javascript version equal to the second one.

```typescript
const element = (
    <Text style={{fontFamily: “bold”}}>
        Hello world!
    </Text>
);

// is equivalent to
const element = React.createElement(
    "Text",
    {style: {fontFamily: “bold”}},
    "Hello world!”
);
```

Beyond its similarity to HTML, JSX/TSX has one key advantage: it makes it much easier to see that the UI elements are organized as a tree, especially when there are more UI elements, by making it clear which element is terminated where (instead of closing 15 parentheses). Elements that have no children can be closed immediately, like in HTML (`<MyComponent/>`). 

In addition, JSX/TSX also deals with separation of concerns. To quote the [documentation](https://reactjs.org/docs/introducing-jsx.html): "React embraces the fact that rendering logic is inherently coupled with other UI logic: how events are handled, how the state changes over time, and how the data is prepared for display. Instead of artificially separating technologies by putting markup and logic in separate files, React separates concerns with loosely coupled units called “components” that contain both. "

To embed TypeScript code in TSX, you just need to open a curly bracket. 

```typescript
const name = "Romain";

<Text style={{fontFamily: “bold”}}>
    Hello {name}!
</Text>
```

And you can "switch back" to TSX if needed. In this example we render a list of items. Note how we must provide a "root component" (the View), so that we keep everything as a tree.

```typescript
const names = ["John", "Jack", "Jill", "Bill", "Belle", "Joan", "Bob"];

<View>
    {names.map(name => {
            return (
                <Text style={{fontFamily: “bold”}}>
                    Hello {name}!
                </Text>
            )
        })
    }
</View>
```

The two things to be careful with TSX are:
- Always define a tree of elements.
- Keep track of when you switch from Typescript to TSX and back. 

Both of these things are easier to keep track of in small amounts of code. To do this, **splitting your rendering code in small components is critical**.

There is more on JSX/TSX in the context of React (web version) here:
- [Introducing JSX](https://reactjs.org/docs/introducing-jsx.html)
- [JSX in Depth](https://reactjs.org/docs/jsx-in-depth.html)

## Components and Props

We have seen that React provides UI elements that can be arranged in a tree. To make this process scaleable, React supports the definition of custom components, that allow to abstract and reuse parts of the UI. 

These components are defined as functions that take "props" (properties) as input, and output a tree of UI elements. Components can "call" other components, specifying the props that they need. **It is often better to split a large component in several smaller components**. This increases both readability and reusability. 

All the "props" are passed as a single object to the component, rather than individual arguments. This makes it easier for the framework to know what the props are. Props are read-only values that **can not be changed**. Should the props change, the component will be re-rendered. Thus props enforce **unidirectional data flow from parent components to children components**. Communication from children to parents will be seen later (through callbacks). 

```typescript

const Greet = (props) => {
    return (
        <Text style={{fontFamily: “bold”}}>
            Hello {props.name}!
        </Text>
    )
}

const GreetAll = (props) => {
    return (
        <View>
            {props.names.map(name => <Greet name={name} />)}
        </View>
    )
}


const App = () => {
    const names = ["John", "Jack", "Jill", "Bill", "Belle", "Joan", "Bob"];

    return (
        <View>
            <Header />
            <GreetAll names={names}/>
            <Footer />
        </View>
    )
}
```

Note that we can take advantage of the destructuring assignment, and type annotations, to make props more visible, and thus make the component can be easier to read:

```typescript
const Greet = ({name}:{name: string}) => {
    return (
        <Text style={{fontFamily: “bold”}}>
            Hello {name}!
        </Text>
    )
}

const ManyProps = ({first, second, third}:{first: number, second: boolean, third: ComplexObject})
    => { 
    // ...
```

There is more on Components and Props for React [here](https://reactjs.org/docs/components-and-props.html). Note that this references Class Components, that we will not see as we don't need them anymore. It's still useful for you to know that they exist, if you come accross them.

# React Native

## React vs React Native

React Native (RN from now on) is based on the React framework. The principal concepts are similar to the ones of React, with some differences that we will cover. RN is also based on the principles of Components that are rendered to form a tree of UI elements, with the same functional-style abstractions (e.g. pure components with Props, adding a carefully managed state), and the same rendering strategies.

What changes significantly is how the concepts are implemented behind the scenes, and the API (the basic components) that is used. This is why RN's tagline is ``learn once, write anywhere'': the concepts are the same, but there are some differences. We will see that porting a component from one framework to the other is not that hard, however.

## RN's implementation

To execute JS in a mobile application, RN uses a JS engine [JavaScriptCore](http://trac.webkit.org/wiki/JavaScriptCore), or [Hermes](https://facebook.github.io/react-native/docs/hermes/) to execute the application, which communicates with a native thread. The JS code is transpiled to ES5 (allowing more recent JS versions to be used), and is minified, along with all the included libraries, to reduce its size. 

The native thread is specific to the platform the application is running in (e.g., iOS, Android, or the web browser). The native thread communicates with the Javascript thread to a bridge. The threads use this bridge to send messages to each other:
- The JS thread indicates to the native thread the native UI components that should be displayed
- The Native thread watches for user activity, and notifies the JS thread when, e.g., a button is pressed. In return, the JS thread can execute callbacks.

One nice property of this model is that both thread execute separately. One thread can be blocked, while the other continues to execute. This is useful to ensure the UI is smooth: the native UI thread does not execute the callbacks itself, it merely sends messages to the JS thread. This is in contrast to for instance, Android, which by default executes all code on the UI thread. Developers must explicitely indicate that codes executes outside of the UI thread. RN makes this automatic, simplifying a significant headache of Android development, which can result in either more complex code or choppy UIs.

## API differences between RN and React

While the base concepts are similar, all the base components are different. In React, they are HTML components, while in RN, they are base UI components instead. For instance, `<div>`s are usually replaced by `<View>`s; `<span>`s, `<p>`s, `<hx>`s are replaced by `<Text>` components (all texts in RN should use the `<Text>` component). HTML `<button>`s will be replaced by RN `<Button>`s which have different properties, or by various [Touchables](https://facebook.github.io/react-native/docs/handling-touches). Lists (`<ul>`, `<li>`) will be often replaced with `<ScrollView>`s, or more advanced [RN lists](https://facebook.github.io/react-native/docs/using-a-listview). 

The documentation lists all the basic components (e.g, for [text input](https://facebook.github.io/react-native/docs/handling-text-input)). We will see additional components on an as-needed basis. Feel free to consult the documentation on your own.

The imported packages and entities will of course be different. Some of the convenient web browser APIs are not provided (e.g. `prompt`), but others have alternate implementations (e.g., `fetch`), and additional packages provide similar functionality.


## Styling components

Styling components is somewhat different in RN than in React, although the general principle is the same: 
- UI components can have [style properties](https://facebook.github.io/react-native/docs/style). 
- They are described by JS objects, with properties that are similar to CSS properties (but not identical, e.g. camelCase is used).
- Example properties include padding, margins, colors, fonts, etc. 
- Style also includes [width and height](https://facebook.github.io/react-native/docs/height-and-width), and [layout with Flexbox](https://facebook.github.io/react-native/docs/flexbox)

The RN tutorials linked above go in quite a lot of details on style. A few general remarks:
- Components are styled with a style property, which is a JS object, this leads to double braces: `<View style={{width: 50, height: 50}}>`.
- Components can have an **array of style objects**. This is useful for modularity: the common parts can be defined separately: 
```javascript
const generalStyle = {color: blue}
// ...
<View style={[generalStyle, {width: 50}]}>
```
- The [StyleSheet](https://facebook.github.io/react-native/docs/stylesheet) package can be used to define stylesheet. The advantage it has is that it is bridge aware: a style sheet can be defined, sent over the bridge, and reused multiple times, without sending the whole style object with the bridge. Only an ID is transmitted over the bridge.
- RN components often come bundled with their styles defined in the same file, as React and RN favor self-contained component. However, common style definitions (e.g., for color themes) can also be defined in common modules, and imported by the actual components, if this is needed.


## A note on framework implicit calls

React and RN are frameworks. In frameworks (in contrast with libraries), some methods or functions are defined by the developer in a declarative manner, and called by the framework, when it needs to. This can make it a bit harder to understand how the code works in the beginning, and can be sometimes harder to debug. But it makes it more productive to work with the framework when one is used to it. 

The entire set of lifecycle methods (including rendering) are examples of methods/functions that are called by React, not explicitely by the developer.



