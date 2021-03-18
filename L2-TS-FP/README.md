# Lab 2: Functional Programming in TypeScript

The goal of this lab is to practice Functional Programming in TypeScript, using data structures representing shapes. The initial code follows with examples follow. Here, we use a special property to denote the type of object inside the object, which facilitates writing code that handles a variety of shapes.

```typescript
interface Point {
    x: number;
    y: number;
}

interface Vector {
    x: number;
    y: number;
}

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

type Shape = Circle|Square|Ellipse|Line|Rectangle

// an example of a function that dispatches on the kind of object
// try commenting out or deleting one of the case statements, 
// and notice that TypeScript highlights that an alternative is missing.
const importantPoint = (shape: Shape):Point => {
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

const myshapes = [c, sq, line, rect, ell]

```

Head over to the [TypeScript playground](https://www.typescriptlang.org/play), and paste the code above there. Then, do the following exercises, using functional programming principles and the higher-order functions defined in the Javascript library (see the [lecture 4](https://github.com/rrobbes/EngineeringOfMobileSystemsV2/blob/main/4-FP/README.md) for links to the documentation:

- define a function that computes the area of a shape (the area of a line being 0)
- compute the area of all the functions in the list `myshapes`
- display the list of shapes that have an area superior to 5
- determine whether there is any shape that has an area greather than 50
- define a function that enlarges or shrink the figures by a `factor` given as an argument. A `factor` greater than 1 enlarges the figures, a `factor` smaller than 1 shrinks it. This should alter the relevant values for each kind of shape. Don't forget to do this in a way that adheres to the principles of functional programming. 
- Transform the list of figures so that all figures have an area greater than 50.
- define a function that moves a shape in a given direction.
- Compute the sum of the area of all the figures

If you finish ahead of time, you can:
- implement a version of the `find` function, as we did with `map`, without using recursion
- implement a version of `find` that does use recursion.
- do the same for `filter`
- do the same for `some`
- do the same for `reduce`
