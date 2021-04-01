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

### How does destructuring assignment work, in general, and on parameters?

The goal of the destructuring assignment is to make it easier to work with lists and objects, and to access the data that is inside them. Essentially, you write a "pattern" of the data inside the list or object you are interested in, and JS/TS will give you the pieces of data you asked for, possibly filling more than one variable in a single line. This is strictly for convenience, you don't need to use if yourself if you don't want to, but you should be able to read it.

```typescript

interface Point {
    x: number;
    y: number;
}
interface Point3D extends Point {
    z: number;
}

// using destructing assignment to access properties of a Point3D
const xplusz = (p3: Point3): number => {
    const {x, z} = p3
    return x + z
}
// equivalent to:
const xplusz = (p3: Point3): number => {
    return p3.x + p3.z
}
// equivalent to:
const xplusz = ({x, z}:Point3): number => {
    return x + z
}

// this does not work, we have two variables with the same name
const notworking = ({x, z}:Point3, {x,z}:Point3): number => {
    return x + z
}
```

Example with lists:
```typescript
// we have a list of points
const myPoints:Point[] = // ... 

// with lists, we can access elements in order, plus we can access whichever elements are left
// p1, p2, p3 are of type Point
// rest is of type Point[] 
const [p1, p2, p3, ...rest] = myPoints

// similarly to objects, you can only access the elements you care about
const [p1, p2] = myPoints
// equivalent to:
const p1 = myPoints[0]
const p2 = myPoints[1]

// we can use this to iterate on lists via recursion
const [first, ...rest] = list

// some special cases
const [first, ...rest] = [1,2,3]
// first = 1, rest = [2, 3]

const [first, ...rest] = [2,3]
// first = 2, rest = [3]

const [first, ...rest] = [3]
// first = 3, rest = []

const [first, ...rest] = []
// first = undefined, rest = []

// we can use this in the parameters of a function too

// this is a function that sums all the elements in a list
const sumlist = (nums: number[]): number => {
    if (nums.length > 0) {
        const [first, ...rest] = nums
        return first + sumlist(rest)
    } else {
       return 0
    }
}

// this is equivalent to
const sumlist = (nums: number[]): number => {
    const [first, ...rest] = nums
    // the list is empty
    // typescript is unable to extract the first element,
    // so it fills if with "undefined", and rest would be an empty list
    if (first === undefined) {
        return 0
    } else {
        return first + sumlist(rest)  
    }
}

// this is equivalent to
const sumlist = ([first, ...rest]: number[]): number => {
    if (first === undefined) {
        return 0
    } else {
        return first + sumlist(rest)  
    }
}
```

### Can you recap the syntax of arrow functions?

To write arrow functions, there are a few ways to do so, depending on some circumstances.

**First, the number of arguments and the usage of parentheses.**
```typescript
// you can always put parentheses to denote what the arguments are:

const noArgumentCallBack = () => // function body
const oneArgFunction = (x) => // function body
const moreArguments = (x, y, z) => // function body

// For the special, but common case where you have a single argument
// you can omit parentheses:

const slightlyShorter = x => // function body 

// Finally, if you use TypeScript type annotations
// then you need parentheses in all cases:

const mustHaveParens = (x: number) => // function body

const tsTwoArgs = (x: number, y:string):boolean => //function body
```

Essentially, if you don't want to think about it, just use parentheses all the time. 

**When to use brackets and the return statement in the body**
One of the use cases of arrow functions, is to write **very short functions, which are anonymous**. For instance:

```typescript
// to write a function inline like this, we would like it to be as short as possible
[1,2,3,4,5,6].map(x => x ** x)

//however, we can also write it like this:
[1,2,3,4,5,6].map((x) => {
       return x ** x
     })

// you can always use curly brackets and a return statement
// if you do, you can have a function body that contains multiple statements
const multipleStatements = (x, y) => {
    const z = x + y
    const t = z ** 4
    return t + z
}

// in the case where the function body is a single statement
// AND you are returning something
// THEN you can omit the brackets and the return keyword
// JS will automatically return the value you compute

const longer = (x) => {
    return x ** x
}

const shorter = (x) => x ** x
```

**One special case, when returning an object**

```typescript
// there can be an ambiguity:
const buildPointButNotWorking = (x: number, y: number):Point => {x: x, y: y}
// it's hard for JS/TS to know if the brackets are for the function body, or the object declaration

// here there are no ambiguities
const buildPoint = (x: number, y: number):Point => {
    return {x: x, y: y}
}

// here, no ambiguities either
// the parentheses help JS determine that we are already inside a function body
// so the brackets are to declare an object
const buildPoint = (x: number, y: number):Point => ({x: x, y: y})

```

### Using console.log in functions
Normally, this should work:

```typescript

const myFunc = (x) => {
    console.log("myFunc")
    console.log(x)
    return x *** x
}
```

A couple of reasons why it could look like it doesn't work would be:
- The function is not actually called, so console.log does not execute
- The function is called, but the value given to console.log is `undefined`, so an empty line is printed

### How can I use the spread operator to build new objects and lists?

When you use functional programming principles, you don't want to directly modify objects, you want to return "new versions" of an object.

This is straightforward for simple objects:
```typescript
interface Point {
    x: number;
    y: number;
}

const translateX = (p: Point, xAmount: number): Point => {
    const newPoint = {x: p.x + xAmount, y: p.y}
    return newPoint
    
const translateY = (p: Point, yAmount: number): Point => ({x: p.x, y: p.y + yAmount})
```

For more complex objects, it would not work very well:
```typescript
interface Point6D extends Point {
    z: number;
    t: number;
    u: number;
    v: number;
}

const translateXdoestNotScale = (p: Point6D, xAmount: number): Point6D => {
    const newPoint = {x: p.x + xAmount, y: p.y, z: p.z, t: p.t, u: p.u, v: p.v}
    return newPoint
}

// using the spread operator, we grab all the properties of an existing object
// and we redefine only the ones that should change
const thisScalesBetter = (p: Point6D, xAmount: number): Point6D => {
    const newPoint = {...p, x: p.x + xAmount }
    return newPoint
}
```

We can use the same thing for objects that are composed of other objects:
```typescript

type Callback = ()=>void;

interface Shape {
    pointA: Point;
    pointB: Point;
    color: string;
    onClick: Callback;
}

const translateShapeX = (shape: Shape, xAmount: number): Shape => {
    const newPointA = translateX(shape.pointA, xAmount)
    const newPointB = translateX(shape.pointB, xAmount)
    return {...shape, pointA: newPointA, pointB: newPointB}
}

// we can use a little trick to make this easier to read
// if a variable is named just like a property, 
// we can directly put it in the object,
// without specifying the property name
// if we want the same
const translateShapeX = (shape: Shape, xAmount: number): Shape => {
    const pointA = translateX(shape.pointA, xAmount)
    const pointB = translateX(shape.pointB, xAmount)
    return {...shape, pointA, pointB}
}

interface Shape2 {
    points: Point[];
    color: string;
    onClick: Callback;
}

// if we have properties that are lists, then we just use 
// higher-order functions to change the data
const translateShape2X = (shape: Shape2, xAmount: number): Shape => {
    const points = points.map((pt: Point) => translateX(pt, xAmount))
    return {...shape, points}
}

interface Drawing {
    shapes: Shape[];
    name: string;
    author: string;
}

const translateDrawing = (d: Drawing, xAmount: number): Drawing => {
    const shapes = d.shapes.map((sh: Shape2) => translateShape2X(sh, xAmount))
    return {...d, shapes}
}
```



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

In the lab, we have one in the solution, which is an example for the `filter`, higher-order function:

```typescript

// we define a type for a function that is a predicate:
// it takes an object of a given type A, and returns a boolean
// this is a function that returns true if an object satisfies a given condition
type predicate<A> = (arg: A)=>boolean

// we define a function called filter, that takes a list of elements of type A
// and returns the list of elements that satisfies the condition
const filter =  <A,> (list: A[], pred: predicate<A>): A[] => {
    // we create a list of results, initially empty
    let results = []
    // for each element in the list
    for (let i = 0; i < list.length; i++) {
        const elem = list[i]
        const satisfies: boolean = pred(elem)
        // if it satisfies the condition, we add it to the list
        if (satisfies) { 
               results.push(elem)
        }
    }
    // we return the list
    return results
}

// another version with recursion and destructuring assignment
const shorterFilter =  <A,> ([head, ...tail]: A[], pred: predicate<A>): A[] => {
    if (head === undefined) return []
    if (pred(head)) return [head, ...filter(tail, pred)]
    else return filter(tail, pred)
}

// example usages
console.log(shorterFilter([1,2,3,4,5,6,7,8,9,10], x => x%2===0))
console.log(shorterFilter([1,2,3,4,5,6,7,8,9,10], x => x%2!==0))

```



