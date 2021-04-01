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



## What does conditional rendering mean?

## How do I use 'useState' and hooks in general for managing states? 

