# Javascript, TypeScript, and FP Recap

If you watch this live, you can post any question (anonymously) [using this form](https://forms.gle/Jn5Dye1EsDKafyNd9). You can use the Teams chat also if you want!

## Javascript questions

### What is the difference in usage between `let` and `const`?

Both of these are ways to declare a variable.

`let` allows you to redefine the variable, while `const` is for defining constants. Constants can not be redefined. If you try to redefine a constant, you will get an error. Most variables are defined once, so it's a good idea to use `const` for this. `const` makes your intent clear: you don't want this variable to change. When doing Functional Programming, then you want do avoid changing data, so you want to have as many `const` as possible, and as few (possibly zero) `let` as possible.

```typescript
let x = 3
x = 4 //this is ok

const y = 3
y = 4 //this is not ok, you will get an error

// const disallow you to redefine the variable, using =
```

`const` is not perfect: when you have an object with some properties, then it is still possible to change the properties of the object. However, you should avoid to do this.

```typescript
const myPoint = {x: 3, y: 3}
myPoint = {x: 4, y: 4} // you can't do that, const forbids it

myPoint.x = 4 // you can do this, but you SHOULD NOT
```

### Why JS does not accept count=count+1, and java does accept this?

Actually, you can do this, if you use the `let` keyword to declare a variable. It's only when you use `const`, that you can not change the value of a variable. Actually, in Java, you can have a similar behaviour, if you use the `final` keyword. 

The difference is in how you use the language, rather than the language itself. If you avoid changing data, or you change it in controlled ways, it makes it easier to avoid some kind of bugs, and to think about what the programs is doing (once you're used to it).

### How does destructuring assignment work on parameters

## TypeScript questions

### What is the actual difference between TS and JS?

TypeScript is a superset of Javascript. This means that any Javascript is also valid TypeScript. This is by design to allow developers to transition from JS to TS. 

However, TypeScript is larger than Javascript: it also supports **type annotations**. You can use type annotations to tell TypeScript the types of variables, parameters, return types, object properties, of your JavaScript code. In addition, TypeScript performs type inference: it can deduce some types from the existing information in the code, such as literals (`const x = 4`), and the existing type annotations. Using type inference, TypeScript helps you avoiding bugs, and the more type annotations you use, the more it helps you.

Essentially, you can use as little TypeScript as you want. But the more you use it, the better it gets.

### What is the syntax difference between TS and JS?

This is JavaScript
```javascript
const x = 8
const y = 9

const point = {x: 4, y: 4}
const point2 = {x: 5, y: 5}

const distance = (p1, p2) => {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    return Math.sqrt(dx ** 2 + dy ** 2)
}
```

This is how we would insert type annotations to make TypeScript typecheck this code

```typescript
// you insert type annotations after the names of the variables
// typescript would be able to infer these annotations by itself
// but it's perfectly fine to add them too
const x: number = 8
const y: number = 9

// we can also provide type annotations for objects and their properties
// here, we say we have an object with two properties, x and y, both numbers
const point:{x:number, y:number} = {x: 4, y: 4}

// usually, we define interfaces or types for our objects
// this allows to name a type, and reuse it elsewhere
type Point = {x:number, y:number}
const point2: Point = {x: 5, y: 5}

// we can also provide type annotations for functions
// for arguments, return type, and variables
const distance = (p1: Point, p2: Point): number => {
    const dx: number = p2.x - p1.x
    const dy: number = p2.y - p1.y
    return Math.sqrt(dx ** 2 + dy ** 2)
}
```

### How much TS do I really need to know?

You don't need to know "that much": 
- You need to use type annotations for arguments and return types of functions. 
- You need to know how to define the types of your objects (otherwise it's easy to send an object that is not compatible)

If you want, you can use more advanced features, such as defining functions with generics, but you don't really need to do this. You would need to do so when you are defining higher-order functions (such as your version of map). In practice, you won't do much of this, rather use existing higher-order functions.

### What is the difference between interfaces and types?

In TypeScript, you can define more advanced types, in two ways, with `type`, or with `interface`. `type` is used to define a more complex type in general, while `interface` is more specialised for data structures. For the basic use case they are similar, but they differ for some use cases. For instance:

```typescript
//with type: 
type Point = {
    x: number,
    y: number
}

// with types, you can define type annotations for other kinds of data
// such as using lists as "tuple"
type ThreeNums = [number, number, number]

const myNums: ThreeNums = [1, 2, 3]

// we can also define types for functions outside of their definition
// which is useful if we have many functions which have the same arguments and return type
// for instance, we can define a function that takes a point, and returns a point
type PointFunc = (p: Point) => Point

const translateX:PointFunc = (p) => {
    return {x: p.x + 1, y: p.y}
}
```

```typescript
//with interface

interface Point {
    x: number;
    y: number;
}

// with interfaces, you can extend an existing interface
// Point3D is a point with an additional property
interface Point3D extends Point {
    z: number;
}

// with interfaces, you can model things that are similar to "class hierarchies".
```


### What file extension do I need to use when using Javascript or TypeScript?
We have four kinds of extensions:
- `.js`: Javascript
- `.jsx`: Supports Javascript and also JSX (where you can have React components), although Expo can also use JSX syntax in `.js` files.
- `.ts`: TypeScript (by definition, also JavaScript, since Javascript is valid TypeScript)
- `.tsx`: TypeScript with support for JSX too (where you can have React components, but also type check them with TypeScript)

In practice, if you use `.tsx`, it supports everything that you will need.


## Functional Programming questions

### Can you give more examples of higher-order functions? 




