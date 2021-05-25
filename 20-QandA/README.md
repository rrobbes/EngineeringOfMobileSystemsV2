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

## "Technical" questions

### difference between useState variants

```typescript
const [thing, setThing] = useState("");
const [thing, setThing] = useState<String>("");
```

