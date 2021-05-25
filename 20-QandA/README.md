# Q and A

## Project and exam questions

### Is it necessary to use typescript on the project?

Yes. It doesn't cost you much, but it can save you a lot of pain by preventing some bugs. If you just provide types to function arguments, component props, and function return values, Typescript will help you a lot.

### How will the exam be carried out? 

It will be an oral exam. I will ask some theoretical questions on the material that we've seen this semester. Some of the questions will be about your project.

### How do the project and exam impact the final grade?

The project will be 50% of the grade, the exam will be 50% as well. The assignments will serve as "bonus", on top of the grade. 

### could you please do some examples of questions that could be done at the exam?

I'll do my best!

### Is it mandatory to do the project in this session?

Yes. You have to pass the project before passing the exam. That's how things work. Note that if you hand in the project but do not pass the exam, you can "keep" your project grade for some time (I believe, not 100% sure, it's one year).

### Do we explicitly have to deliver the project as snack link? Can we just send the folder where you have to run only npm install?

I would much prefer snack links. Put yourselves in the shoes of the guy that has to correct something like 25+ projects. Everything that you can do to help me is great.

Note that you can import a project from github, directly in a snack. Please try to do this. If you have technical issues that prevent you from using a snack, then let me know.

### Incompatibilities between iOS and Android

I can test with an Android Emulator easily. If you can try out on both platforms via simulators, it's of course better. Try to find a "plan B". Note that you can perform conditional rendering based on the platform you are on. To use platform-specific code, have a look at [this part of the documentation](https://reactnative.dev/docs/platform-specific-code).

If you are aware of an incompatibility or simply have some doubts about a specific incompatibility, do let me know. Write it in some kind of "readme" file in the project.

### I'm doing the project alone. So do I have to do 'only' the requirements for everyone to get the maximum points or can I get extra points for doing the requirements dedicated to group works?

If you're alone, you only need to do the functionality of the "alone" requirements to get full points on functionality. If you do more than that (e.g. group requirements while alone), I will consider it in some ways (I might be more lenient on style issues, and/or a small bonus). For sure it's going to be a good learning experience for you!

### Is it okay if a component is not working on the web in expo but both in android and ios?

Yes. It's much better than the opposite (working on web but not on ios/android). I will try on devices/simulators.

### Could you provide some further information about how you will grade the projects? F.e. the importance you will give to how we implement the requested functionalities or the weight you will assign to how we structure our app, etc. What are key elements you'll evaluate in order to grade us?

The key elements for grading will be:

- The functionality of the project (how far did you go?). You will not fail if you're missing a few bits of functionality.
- Also, the programmign style is important. Try to follow the principles seen in class, to develop components that are reusable and not too big, in particular.
- If possible, try to be cross-platform (but in case you can't, for this it is not as important as the other two criteria).

## "Technical" questions

### difference between useState variants

```typescript
// pure javascript
const [thing, setThing] = useState("");

// using typescript generics
const [thing, setThing] = useState<string>("");
```
The second one has a typescript type annotation, which makes it much easier for typescript to figure out the necessary types. TS "knows" that `thing` is of type `string`, and it can use this information. TS for instance will complain if you do `setThing(42)`, since `42` is not a string. The second one is recommended and will make your code more reliable.

Additional useState variants (reminder):

```typescript
// you can provide a function to compute the initial value
const [thing, setThing] = useState<string>(() => "");

// setThing can take as argument a callback, that will take as argument the previous version of the state

setThing((oldThing: string) => {
  const newThing = "new " + oldThing
  return newThing
  })
  ```
  
### How can I integrate a tab navigator with another navigation form?   
For example I have a tab navigator with 3 pages and I want to make one button from one page to another (not tabbed page) but with NOT TAB button, hence I need another navigation form for example a StackNavigator, but its hard to integrate both. I read the documentation regarding nested navigators but its super complicated :(

=> Nesting should work. I'm missing more details to answer it effectively. 
[Nesting API documentation](https://reactnavigation.org/docs/nesting-navigators/)

### I would like to know better how to handle state from a child component to a parent. 

For example, if I have a Form component that contains text fields (f.e. For Name and Surname), and I have some actions I perform on these input values in my Form Component but also in a Parent Component (f.e. a general Home Component that contains our Form), how would I handle something like this?  

=> The general issue is "how can the parent component know about the data if it is in the child component?". Basically what you want to do here is to pass a callback from the Parent Component to the Form Component. The Form component will call the callback when the data  is "ready", which will execute code from the Parent component.

```typescript

type StringCallback = (arg: string) => void

const Child = ({onDataReady}:{onDataReady:StringCallback}) => {
    const [text, setText] = useState<string>("text field data")
    
    // callback for a button in the rendered code
    const onPress = () => {
        onDataReady(text)
    }
    
    return // render a text field that uses the text, plus a "submit" button with onPress as callback...
}

const Parent = () => {
    const handleIncomingData = (data: string) => {
        // ...
    }

    return <Child onDataReady={handleIncomingData} />
}
```

### For some components I happen to use too many useState variables; which are some of the available alternatives or solutions that could help me reduce them?

The answer in general would be to split a component in several smaller components. One thing that might make this difficult is if some components need to access some "data" from children components. See above for how to handle these cases with callbacks.

Another way to split things up is to use custom hooks, which allow to separate logic from the UI.

As a guideline, my impression is that if a component has more than 3 or 4 state variables, it starts to become "too big"; in that case you should try to split it up. 

### Could you please talk again about useState and useEffect? 

useState allows us to define persistent state in a component. The state persists across re-renders. Unlike other means to have state, useState has a special property, which is that if the state changes, this causes the component to re-render, which ensures that the component always has the latest state available, no matter what. 

useEffect allows us to run code that would take too long to execute while we are rendering a component, such as async code (web queries, etc). The component is rendered, and effects are executed after rendering. Once the results of the code come in, the effect can change the state of the component, which can cause to re-render, allowing us to see the results of this code. For instance:

- render an initial version of the component
- execute a query to fetch new data
- get the data
- set the state
- re-render the component with new data

useEffect has an array of dependencies so that it knows when to reun the effect again (when the dependencies change), and support "cleanups" when a new effect is executed, if necessary.

### Context API

The context API essentially allows us to share state between several components. Otherwise, each component would have it's version of the state. Usually we want the components to NOT share their state, but sometimes we do. In this case, we use context. If the context contains pieces of react state, then the components that use the context will be re-rendered when this react state changes.

### Lists with nested objects

Lists can contain arbitrarily complex objects. If one wants to produce a new version of the list, the `...` operator is useful to copy parts of lists and/or objects. See one of the previous Q and As for this. If the question was about something else, please let me know!

