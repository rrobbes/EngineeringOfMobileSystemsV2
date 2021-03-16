
# TypeScript with React

React, React Native, and Expo come with very good Typescript support. In fact, creating an Expo project in Typescript simply involves picking the "typescript" options when using `expo init`. React components also have type definitions, and the JSX syntax is supported.

## Function Components

The React and JSX type definition provide the `React.FunctionComponent<Props>`interface, where `<Props>` is a generic, and corresponds to the type alias or interface of the props that the component accepts. The Props is a Javascript object, so each property of this object would be an argument of the JSX call.

```typescript
interface NamedPoint {
  x: number,
  y: number,
  name?: string //optional prop
}

const PointComponent: React.FunctionComponent<NamedPoint> 
  = props => {
    return (
      <View>
        <Text>X is {props.x}</Text>
        <Text>Y is {props.y}</Text>
        <Text>Name is {props.name}</Text>
      </View>
    )
  }

//OK
<PointComponent x={2} y={3} name="my point"/> 

//Still OK, name optional
<PointComponent x={2} y={3} /> 

// Error, incompatible types
<PointComponent x="2" y={3} /> 
```

## Class Components 

Class components can be typechecked with the `React.Component<Props,State>` interface, where `<Props>` and `<State>` are two generic interfaces, similar to the example above.


## Renderable objects

The React.ReactNode interface defines everything that can be rendered in a component (it is the return type of React.Component or React.FunctionComponent).

## React.ReactElement<T>

If you store React elements in variables, you can use this type to ensure something is a ReactElement, and that it matches type <T>

## React.Component<T>

This is a type that accepts Props, and matches both FunctionComponent and ClassComponent.

## Generic components

The props of a component can also accept generic arguments. In some cases, there can be some ambiguity between generics and JSX syntax. 

```typescript
const foo = <T>(x: T) => x // breaks
const foo1 = <T extends {}>(x: T) => x //workaround

function foo2<T>(x: T): T { return x} 

// declaring types first works best
const foo3: <T>(x: T) => T
    = x => x
```

## Default props
Function components can be easily typed with default value for props. Class components are more complex.


