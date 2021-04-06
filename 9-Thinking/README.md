# Thinking in React

Now that you start to know how to build individual components, we can start thinking how to **combine** components in order to build larger applications. 

When working with larger applications that have more components, it becomes important to think about the following:

- How to define a hierarchy of components to render a more complex UI
- How to pass data, and which data, from parent components to children components
- Which of the components should have state, in addition to data coming via props
- How can children components communicate with parent components, when it is necessary.

There is a nice resource on React's website on how to define an application with React, with a nice step-by-step example. Have a look here. Briefly, the steps are:

- Break the UI in a component hierarchy (who would have guessed?). To determine if a component should be broken down in sub-components, a good guide is the single responsibility principle: one component should do one thing only. A component that does more than one thing should probably be split into several sub-components.
- Build a static version of the UI in React (rendering a fix data structure). This can be helpful to separate thinking about design aspects from thinking about the state and interactions with the application.
- Identify the minimal state needed (and what part of the data can be simply computed, not kept as state). State is needed to represent aspects of the application that will change over time, but it should be kept to a minimum.
- Identify where the state should live (i.e., which component should manage which state). Once you identify which state you need, it's important to place it correctly in the component hierarchy. In general, a piece of state should be placed in such a way that it can be passed as props to all the components that may need it. Thus the state should be put in the closest parent component of all the components that may need it.
- Add Inverse data flow (passing callbacks as props to the components that need it). If state is shared between components, then children may need to notify the parent of a state change. This is called inverse data flow, since the usual data flow (via props) is from parents to children, not children to parents. To do so, a **callback can be passed by a parent in a prop**. The child component can execute it with the relevant information. This is what is done with buttons, text inputs, switches. It can also be used in your components.

