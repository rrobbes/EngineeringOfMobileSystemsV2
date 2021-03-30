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

### How does destructuring assignment work on parameters

## TypeScript questions

### What is the actual difference between TS and JS?

TypeScript is a superset of Javascript. This means that any Javascript is also valid TypeScript. This is by design to allow developers to transition from JS to TS. 

However, TypeScript is larger than Javascript: it also supports **type annotations**. You can use type annotations to tell TypeScript the types of variables, parameters, return types, object properties, of your JavaScript code. In addition, TypeScript performs type inference: it can deduce some types from the existing information in the code, such as literals (`const x = 4`), and the existing type annotations. Using type inference, TypeScript helps you avoiding bugs, and the more type annotations you use, the more it helps you.

Essentially, you can use as little TypeScript as you want. But the more you use it, the better it gets.

### What is the syntax difference between TS and JS?

### How much TS do I really need to know?

## Functional Programming questions

### Can you give more examples of higher-order functions? 




