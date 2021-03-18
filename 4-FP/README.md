# Functional Programming

Functional Programming is the process of building software by composing pure functions. A pure function is a function, which, given the same inputs, always returns the same outputs, and has no side effects. Side effects may include: mutation, relying on shared state, I/O, asynchronous code, etc. To make our job easier, we should limit side effects.

## Characteristics of Functional Programming
- Pure functions are predictable and reproducible
- Separation of concerns: try to make one function do one thing only
- Composition: write functions whose outputs are the input of others
- Immutability: mutating data erases its previous values 
- Memoization: predictable functions are easier to cache
- Parallelism: predictable functions are easy to parallelize

## Counter examples

### Relying on global state
The following snippet shows a function that is not neither predictable, nor reproducible, as it relies on global state. Changing the global variable changes the output of the function. This can happen at any time.

```typescript

let globalVar = 4

const notPredictable = (x: number):number => {
    return x + globalVariable
}

notPredictable(4) 
// returns 8

globalVar = 6

notPredictable(4)
// returns 10
// same input, different output

```

### Altering the input
The following snippets shows a different way a function can be not reproducible: if the arguments are altered, calling the function with the same argument will yield a different result.

```typescript

interface NumberedObject {
    amount: number;
    type: string;
}
let myPotatoes: NumberedObject = {amount: 10, type: 'potatoes'}

const notPredictable = (obj: NumberedObject):void {
    console.log(`You have ${amount} of ${type}`)
    obj.amount = obj.amount - 1
}

notPredictable(myPotatoes)
//oh no, I lost a potato!

notPredictable(myPotatoes)
//the output will be different now

```

### Hard to avoid side effects 

Some side effects are harder or impossible to avoid. Any user input or data fetched from disk or the internet during program execution is unpredictable, yet we need these functionalities to do many useful things. Rather than avoid these entirely, we should limit their usage to well-compartimentalized sections of our programs. We will see how to do this later on. 

## Functional programming in Typescript

Several features of Typescript and Javascript make it possible to use functional programming principles. For the first example, it is simple: we just need to break the dependency to the global variable, by passing a variable as an argument instead. We should also avoid using `let`, prefering `const` instead, to avoid a variable being redefined unless absolutely necessary.

```typescript
// the function does not depend on global state anymore
const predictable = (x: number, notGlobal: number):number => {
    return x + notGlobal
}
```

For the second example, it is a bit more complex. In order to avoid mutating a data structure, we need to instead return a new object. In general, pure functions always return a value (not void). In order to copy objects or list, the spread operator (`...`) can be used. With the spread operator, we copy all the properties of the initial object. After that, we can just list the properties we would like to change in the modified object.

```typescript

interface NumberedObject {
    amount: number;
    type: string;
}

const myPotatoes: NumberedObject = {amount: 10, type: 'potatoes'}

const predictable = (obj: NumberedObject):NumberedObject {
    console.log(`You have ${amount} of ${type}`)
    return {...obj, amount: obj.amount - 1}
}

const lessPotatoes = predictable(myPotatoes)
// myPotatoes does not change
// the result is the updated version of the argument

predictable(myPotatoes)
//the output is the same now

```

# Higher-order functions 

Functions in Typescript and Javascript can be passed as arguments to other functions. This can be used to perform many data transformations in the functional paradigm. These can replace many usages of `for` or `while` loops in other alternatives. A higher order function is a function that takes another function as an argument.

## The higher-order function map

Suppose we need to double a list of numbers:

```typescript
const double = (nums: number[]): number[] => {
    let results = []
    for (let i = 0; i < nums.length; i++) {
        const doubled = nums[i] * 2
        results.push(doubled)
    }
    return results
}

const doubles = double([1, 2, 3, 4]) // [2, 4, 6, 8]
```

Now, suppose we need to double the x coordinate of a set of points, while keeping the y coordinate unchanged:

```typescript
interface Point {
    x: number;
    y: number;
}

const doublex = (points: Point[]): Point[] => {
    let results = []
    for (let i = 0; i < points.length; i++) {
        const doublex = {...points[i], x: points[i] * 2}
        results.push(doublex)
    }
    return results
}

doublex([{x:1 y:2}, {x: 3, y: 4}]) // [{x: 4, y: 2}, {x: 6, y: 4}]
```

Finally, suppose we need to take a list of numbers, and return a list of points, with 0 as the x coordinate, and one of the numbers as the y coordinate:

```typescript

const num2point = (nums: number[]): Point[] => {
    let results = []
    for (let i = 0; i < nums.length; i++) {
        const point = {x: 0, y: nums[i]}
        results.push(point)
    }
    return results
}

num2point([1,2,3,4]) // [{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}]
```

Aren't these functions very similar? The only part that changes is the part that computes what to put in the result array.  Could we try to pass this as a parameter? Let's first do a version without worrying too much about types.

```typescript

const processList = (list: any[], process: any): any[] => {
    let results = []
    for (let i = 0; i < list.length; i++) {
        const processed = process(list[i])
        results.push(processed)
    }
    return results
}

const double = (x: number): number => {return x * 2}
processList([1,2,3,4], double) // [{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}]
```

This is essentially what the map function does. Now, let's properly type it. First, let's make it work only for the case of numbers (like the `double` function).


```typescript
// We first define a type for a function that takes a number and returns a number.
type numberFunc = (arg: number)=>number

const processList = (list: number[], process: numberFunc): number[] => {
    let results = []
    for (let i = 0; i < list.length; i++) {
        const processed = process(list[i])
        results.push(processed)
    }
    return results
}

const double = (x: number): number => {return x * 2}
```

We now make a version that works for any type of arguments:
```typescript
// We first define a type for a function that takes a type A and returns a type B
type transformFunc<A, B> = (arg: A)=>B

const map = <A, B> (list: A[], transform: transformFunc<A, B>): B[] => {
    let results = []
    for (let i = 0; i < list.length; i++) {
        const processed = transform(list[i])
        results.push(processed)
    }
    return results
}

const num2point = (n: number): Point => {
    return {x: 0, y: n}
}

map([1, 2, 3, 4], num2point)

//even shorter
map([1, 2, 3, 4], n => ({x: 0, y: n}))
```

## Higher-order functions on lists
Since JS functions can be passed as arguments, a lot of data transformations can be expressed with higher-order functions in the functional programming paradigm, beyond `map`. The only difference with our version of map is that they are defined as methods of arrays class, rather than standalone functions.

```typescript
// types for the functions one can pass to the HOfs
type func<A> = (arg: A) => unknown

type transform<A, B> = (arg: A)=>B

type predicate<A> = (arg: A)=>boolean

type reducer<A, B> = (acc: B, val: A) => B
```

- [every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) `[A], predicate<A> => boolean`: Takes a list and a predicate (a function that takes a list element and returns a boolean). Returns true if **all elements** in the list satisfy the predicate, false otherwise.
- [some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) `[A], predicate<A> => boolean`: takes a list and a predicate. Returns true if **at least one element** in the list satisfies the predicate, false otherwise.
- [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) `[A], predicate<A> => A`: takes a list and a predicate. Returns the **first element** that satisfy the predicate (if none satisfy it, returns `undefined`)
- [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) `[A], predicate<A> => [A]`: takes a list and a predicate. Returns a new list with all the elements that satisfy the predicate.

- [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) `[A], func<A> => undefined`: Takes a list and a function f, and applies f to each list element. 
- [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) `[A], transform<A, B> => [B]`: Takes a list and a function f, applies f to each list element, and returns all the results. 
- [flatMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap) `[A], transform<A, [B]> => [B]`: same thing as map, but if f returns a list, the result will be nested lists. So flatMap flattens the resulting list before returning it.
- [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) `[A], reducer<A, B>, B => B`. Takes a list, an initial value, and a function. Applies the function to each element in turn, accumulating the results. Returns a single result.
- [reduceRight](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight) `[A], reducer<A, B>, B => B`. Same thing as reduce, but start from the right.

Note: in JS, the HOFs are methods of arrays, rather than taking a list as an argument. Furthermore, most of the HOF for arrays may also take as argument the current index in the array, and the array contents, if they need it. See more 

```javascript
const list = [1, 2, 3, 4, 5, 6]
const squares = list.map(x => x * x)
const bigSquares = squares.filter(x => x > 10)
const bigSum = bigSquares.reduce((acc, x) => acc + x, 0)
```

## HOFs on functions

Other HOFs just take another function as argument:
- [call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) `(x y z => t) x y z => t`
- [apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) `(x y z => t) [x y z] => t`
- [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)  `(x y z => t) x => (y z => t)`, to perform partial evalaution

```javascript
const twoArgFunc = (x, y) => x * y
const oneArgFunc = twoArgFunc.bind(twoArgFunc, 2)
```

Often, defining closures with anonymous functions is easier. 
```javascript
const twoArgs = (x, y) => x * y
const bind1 = (f, x) => ((y) => f(x, y))
const oneArg = bind1(twoArgs, 2)
```

It's easier to bind other arguments in this way:
```javascript
const divide = (x, y) => x / y
const bind2 = (f, y) => ((x) => f(x, y))
const div2 = bind2(twoArgs, 2)
```

