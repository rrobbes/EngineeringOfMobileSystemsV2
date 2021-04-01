# React Native Recap

## Can you recap the JSX syntax?

JSX allows you to embed UI components (HTML for React, Native UI components for React Native), directly in your JS or TS code. Three things to be mindful about:
- What is the JSX syntax
- How to "switch" from JS to JSX
- How to "switch" from JSX to JS

JSX in a nutshell
```typescript

const componentTree = (
    <View>
        <Component1 />
        <ComponentWithChildren>
              <Child1/>
              <Child2/>
              <Child3/>
        </ComponentWithChildren>
        <Text>
          This is a visible text
        </Text>
        <ComponentWithProps title="Hello" size=38 />
        <PropsAndChildren name="Component">
          <Child1 name="child1"/>
          <Child2 name="child2"/>
        </PropsAndChildren />
    </View>
)

// to define a component, we define a function
// props will be passed as parameters, in a single "prop" object
const ComponentWithProps = (props) => // ...

// I prefer to use destructuring assignment to clearly see the props
// at the start of the component
const ComponentWithProps = ({title, size}) => //

// even better, we can use TypeScript to provide type annotations to the props:
const ComponentWithProps = ({title, size}:{title: string, size: number}) => // ...

// if we have a set of props that is common enough, we can define a type or an interface for them
type TitleSizeProps = {title: string, size: number}
const ComponentWithProps = ({title, size}:TitleSizeProps) => // ...
```

To switch from JS to JSX, we simply start typing a component name, starting with an angle bracket. It is advisable to wrap the component tree in parentheses, because sometimes you avoid some kind of parse errors. 

```typescript

const ComponentWithProps = ({title, size}:TitleSizeProps) => {
    const subtitle = "the size is " + size
    
    return (
        <View>
            <Text>{title}</Text>
            <Text>{subtitle}</Text>
        </View>    
    )
}
```

To switch from JSX to JS, you simply open a curly bracket. We have to be careful when there is an object or a list, and make sure that the brackets are matching correctly

```typescript

const ComponentWithProps = ({title, size}:TitleSizeProps) => {
    const subtitle = "the size is " + size
    const simpler = {to: "declare objects outside of JSX"}
    return (
        <View>
            <Text>{title}</Text>
            <Text>{subtitle}</Text>
            <OtherComponent listProp={[1, 2, 3, 4]} objectProp={{declare: "object", property: "value", notice: "the two brackets"}} />
            <ThirdComponent objectProp={simpler} moreReadable={true} />
        </View>    
    )
}
```

## What does conditional rendering mean?

Conditional rendering is a strategy to render applications with some degree of complexity (later we will see other ways that work for even larger applications). 

- Every component is rendered, which eventually produces a tree of UI elements
- Conditional rendering simply refers to rendering a different thing when a different condition applies

```typescript

type Item = // ...

const ConditionalComponent = ({item, details}:{item: Item, details: boolean}) => {

    if (details) {
        return (
            <View>
               <Text>Name: {item.name}</Text>
               <Text>Price: {item.price}</Text>
               <Text>Colour: {item.colour}</Text>
               <Text>Warranty: {item.warranty}</Text>
              </View>
              )
      } else {
        return ( 
             <View>
               <Text>Name: {item.name}</Text>
               <Text>Price: {item.price}</Text>
             </View>
             )
     }
}

// slightly shorter
const ConditionalComponent = ({item, details}:{item: Item, details: boolean}) => {
      return (
           <View>
               <Text>Name: {item.name}</Text>
               <Text>Price: {item.price}</Text>
               {details?(<View>
                             <Text>Colour: {item.colour}</Text>
                             <Text>Warranty: {item.warranty}</Text>
                          </View>)
                        :null}
              </View>
          )
}

// we can also use more components, if necessary
const ConditionalComponent = ({item, details}:{item: Item, details: boolean}) => {
      return (
           <View>
              <BasicItem item={item}>
              {details?<ItemDetails item={item}/>:null}
           </View>
          )
}

```

We can also do conditional rendering with more complex conditions, such as using a switch statement, for instance, or numeric conditions, etc.


## How do I use 'useState' and hooks in general for managing states? 

You should use `useState` to define state that is relevant for a specific component. An important part of designing a React application is determining which component should have which part of the state. In general, the state should be as close as possible to the component that will end up needing it.

```typescript
// this component uses state to togle the amount of details needed
const ConditionalComponent = ({item, initialDetails}:{item: Item, initialDetails: boolean}) => {
      const [details, setDetails] = useState<boolean>(initialDetails)
      return (
           <View>
              <BasicItem item={item}>
              {details?<ItemDetails item={item}/>:null}
              <Switch value={details} onValueChange={newValue => setDetails(newValue)} />
           </View>
          )
}

```

## Why does React ask that my components have a key, and how can I give one to them?

If you go [this app](https://snack.expo.io/@rrobbes/todo-app), and you delete line 66 (` key={todo.id}`), you will notice that the application works, but behaves strangely: when adding some todos, if some of the todos are marked as done (by pressing the switch), the switches appear to "move". It's most obvious when todos are alternating, one done, one not.

Conceptually, React could re-render all the components anytime a piece of data (either in state or in a prop) changes. However, this would be too slow. React then does some optimization, to avoid re-rendering everything. What it does is to only re-render the components that have some changes in them (either in props or in state). To figure out what has changed React uses a Tree differencing algorithm. This algorithm takes two trees A and B, traverses them, and produces a list of the changes that you can apply to tree A, in order to obtain tree B. These changes would be for instance:

- Add a node below node X in tree A
- Remove node Y in tree A
- ...

In the todo app, for instance, if you mark a todo as done, then the change would be "enable the switch below todo number X in this list". If you add a todo, the change should be "add a todo between todos Y and Z in the list" (or "add a todo at begining of the list or "add a todo at the end of the list").

When we have a list of components that are all of the same type, it is hard to detect which ones change when components are added or removed in the list. If you add an element at the begining of the list, React "should" deduce that the elements must be shifted one place to the right, but it wont. It will instead add an element to the end of the list, and change all the previous elements. Here is an example with removing.

- Old list: [A, B, C, D, E]
- New List: [B, C, D, E]
- Ideal change: Remove "A"
- Detected changes: Rename "A" to "B", rename "B" to "C", rename "C" to "D", rename "D" to "E", remove "E"

To avoid this, React uses a special "key" prop, that it uses to detect differences. The "key" must be a string, and must be unique for each element below a given node in the tree.

- Old list: [A (key="a"), B (key="b"), C (key="c"), D (key="d"), E (key="a")]
- New List: [B (key="b"), C (key="c"), D (key="d"), E (key="e")]
- Detected change: Remove "A"

Since React needs the help of the key to figure out differences in the tree, it gives a warning when the keys are absent in places where it would need them, such as when rendering lists of elements.

Recommendation: to avoid issues of performance (and occasional visual bugs) while rendering lists of components, always include a "key" prop when you are rendering lists in this way.

