// Partial solutions

// Welcome to the TypeScript Playground, this is a website
// which gives you a chance to write, share and learn TypeScript.

// You could think of it in three ways:
//
//  - A place to learn TypeScript in a place where nothing can break
//  - A place to experiment with TypeScript syntax, and share the URLs with others
//  - A sandbox to experiment with different compiler features of TypeScript


interface Point {
    x: number;
    y: number;
}

interface Point3D extends Point {
    z: number;
}

const ptAdd = (p: Point, p2: Point): Point => ({x: p.x + p2.x, y: p.y + p2.y})

type PointFunc = (p:Point) => Point

const translateX:PointFunc = (p) => ptAdd(p, {x: 0, y: 1})

const p:Point = {x: 3, y: 0}

const p3d:Point3D = {...p, z: 8}

interface Vector {
    x: number;
    y: number;
}

const vectorFun = (vec: Vector): number => {
    return vec.x + vec.y
}

vectorFun(p)
vectorFun(p3d)

const distance = (p1: Point, p2: Point):number => {
    const dx: number = p2.x - p1.x
    const dy: number = p2.y - p1.y
    return Math.sqrt(dx * dx + dy * dy)
}

// alternative using destructuring assignment
const distance2 = ({x, y}: Point, p2: Point):number => {
    const dx: number = p2.x - x
    const dy: number = p2.y - y
    return Math.sqrt(dx * dx + dy * dy)
}

const p1: Point = {x: 2, y: 3}
const p2: Point = {x: 2, y: 3}

console.log(distance(p1, p2))

// defining more complex objects

interface Circle {
    kind: "Circle";
    center: Point;
    radius: number;
}

interface Square {
    kind: "Square";
    corner: Point;
    side: number;
}

interface Ellipse {
    kind: "Ellipse";
    center: Point;
    radius1: number;
    radius2: number;
}

interface Line {
    kind: "Line";
    start: Point;
    direction: Vector;
    length: number;
}

interface Rectangle {
    kind: "Rectangle";
    corner: Point;
    width: number;
    height: number;
}



const c: Circle = {kind: "Circle", center:  {x: 2, y: 3}, radius: 2}

const sq: Square = {kind: "Square", corner: {x: 2, y: 3}, side: 3}

const line:Line = {kind: "Line", start: {x: 2, y: 3}, direction: {x: 0, y: 1}, length: 5}

const rect: Rectangle = {kind: "Rectangle", corner: {x: 4, y: 8}, width: 1, height: 2}

const ell: Ellipse = {kind: "Ellipse", center: {x: 7, y: 2}, radius1: 4, radius2: 2}

// a "union type" of possible objects
// if we change the definition of this type, such as adding a new shape, 
// Typescript will check where we use it to look for problems
type Shape = Circle|Square|Ellipse|Line|Rectangle

// if you comment out the previous Shape definition, and uncomment out the next one
// this is still ok

// type Shape = Circle|Square|Ellipse|Line|Rectangle

// this one is not ok 
// we would need to change the implementation of ImportantPoint
//interface Cone {
//    apex: Point;
//    base: Circle;
//}
//type Shape = Circle|Square|Ellipse|Line|Cone

const importantPoint = (shape: Shape):Point => {
    if ('center' in shape) {
        return shape.center
    } else if ('corner' in shape) {
        return shape.corner
    } else {
        return shape.start
    }
}

const importantPoint2 = (shape: Shape):Point => {
    switch (shape.kind) {
        case "Circle":
        case "Ellipse":
            return shape.center;
        case "Square":
        case "Rectangle":
            return shape.corner;
        case "Line":
            return shape.start
    }
}

const area = (shape: Shape): number => {
    switch (shape.kind) {
        case "Circle": return Math.PI * (shape.radius ** 2)
        case "Square": return shape.side ** 2
        case "Rectangle": return shape.width * shape.height
        case "Ellipse": return shape.radius1 * shape.radius2 * Math.PI
        case "Line": return 0
    }
}

const larger = (shape: Shape, factor: number): Shape => {
    switch (shape.kind) {
        case "Circle": return {...shape, radius: shape.radius * factor}
        case "Square": return {...shape, side: shape.side * factor}
        case "Rectangle": return {...shape, width: shape.width * factor, height: shape.height * factor}
        case "Ellipse": return {...shape, radius1: shape.radius1 * factor, radius2: shape.radius2 * factor}
        case "Line": return {...shape, length: shape.length * factor}
    }
}

const moveShape = (shape: Shape, direction: Vector): Shape => {
    const newPoint = ptAdd(importantPoint(shape), direction)
     switch (shape.kind) {
        case "Circle":
        case "Ellipse":
            return {...shape, center: newPoint}
        case "Square":
        case "Rectangle":
            return {...shape, corner: newPoint}
        case "Line":
            return {...shape, start: newPoint}
    }
} 

const distOrigin = (shape: Shape):number => distance(importantPoint(shape), {x: 0, y: 0})

const myshapes = [c, sq, line, rect, ell]
/*
console.log(myshapes.map(area))
console.log(myshapes.map(s => area(larger(s, 2))))

console.log(myshapes.map(distOrigin))
console.log(myshapes.map((s, idx) => moveShape(s, {x:idx, y: 0})).map(distOrigin))

console.log(myshapes.map(s => larger(s, 2)).filter(s => area(s) > 10))
*/
//type numberFunc = (arg: number)=>number


const num2point = (n: number): Point => {
    return {x: 0, y: n}
}



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

const notFine = (x: number): string => "hello" + x

console.log(processList([1, 2, 3], notFine)) //typescript is not happy
console.log(processList([1, 2, 3], double))
console.log(processList([1, 2, 3], num2point)) //typescript is not happy

type transformFunc<A, B> = (arg: A)=>B

const map = <A, B> (list: A[], transform: transformFunc<A, B>): B[] => {
    let results = []
    for (let i = 0; i < list.length; i++) {
        const processed = transform(list[i])
        results.push(processed)
    }
    return results
}


const shorterMap = <A, B> ([head, ...tail]: A[], transform: transformFunc<A, B>): B[] => {
    if (tail.length === 0) return []
    else return [transform(head), ...map(tail, transform)]
}

console.log(map([1, 2, 3], notFine)) //typescript is happy!
console.log(map([1, 2, 3], double))
console.log(map([1, 2, 3], num2point)) //typescript is happy!


console.log(shorterMap([1,2,3,14,15], x => x * x))

type predicate<A> = (arg: A)=>boolean

const filter =  <A,> (list: A[], pred: predicate<A>): A[] => {
    let results = []
    for (let i = 0; i < list.length; i++) {
        if (pred(list[i])) results.push(list[i])
    }
    return results
}

const shorterFilter =  <A,> ([head, ...tail]: A[], pred: predicate<A>): A[] => {
    if (head === undefined) return []
    if (pred(head)) return [head, ...filter(tail, pred)]
    else return filter(tail, pred)
}

console.log(shorterFilter([1,2,3,4,5,6,7,8,9,10], x => x%2===0))
console.log(shorterFilter([1,2,3,4,5,6,7,8,9,10], x => x%2!==0))
