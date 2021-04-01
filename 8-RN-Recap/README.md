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

