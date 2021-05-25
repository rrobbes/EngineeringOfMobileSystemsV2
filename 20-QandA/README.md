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

