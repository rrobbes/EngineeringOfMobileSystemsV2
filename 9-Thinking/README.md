# Building larger applications

Now that you start to know how to build individual components, we can start thinking how to **combine** components in order to build larger applications. 

When working with larger applications that have more components, it becomes important to think about the following:

- How to define a hierarchy of components to render a more complex UI
- How to pass data, and which data, from parent components to children components
- Which of the components should have state, in addition to data coming via props
- How can children components communicate with parent components, when it is necessary.

The following general principles apply:

- As mentioned several time already, React is influenced by functional programming concepts. This means that you should limit the amount of state you use, and limit the number of components that have state.
- React emphasizes composing components, over defining class hierarchies (in fact, I haven't shown you how to define class hierarchies!). This is also in accordance with functional programming, where composition of simple functions is emphasized.  
- In React, it's easy to pass data from components to sub-components. Data tends to flow down the tree of UI components, via props. This is how, for instance, a component handling a list of data items can show each item by rendering a component for each individual item, passing the item as a prop. 
- To transmit information to parent components (inverse data flow), callbacks passed as props should be used. The parent component can defines a callback, and passes it to the child component. For instance, if a child component wants to change some piece of state owned by the parent, the parent should pass a callback allowing it to do so. The child will call the callback when it wants to notify the parent component of such a state change.
- Based on this, if two components need to share state that changes, the best location to put it is in a parent that they have in common. State should be lifted to this component. The children components will then be updated when the state change. They can request changes to the state using callbacks.

## Callbacks as props
The following example shows how a basic example of a callback as prop, inspired from the [Todo app](https://snack.expo.io/@rrobbes/todo-app). In it, we have a todo list, where each item is rendered as a component. However, all the state is managed by the todo applications. Items do not have state, but they are passed callbacks when they want to notify the parent of a change.

```typescript
// a todo item
interface Task {
    id: number;
    task: string;
    checked: boolean;
}

// the type of a callback: a function that does not take any argument and return nothing
// this is enough to notify that an event occured (like a button press)
type Callback0 = () => void

// another type of callback, where more information is needed, and passed as an argument to the callback
// in this case the callback takes a string as argument
type StrCallback = (arg: string) => void

// a todo that can be ticked off (onChecked), deleted (onDelete), or edited with a new content (onEdit). How to do this is specified via callbacks
const Todo = ({task, onChecked, onDelete, onEdit}:{task: Task, onChecked: Callback0, onDelete: Callback0, onEdit: StrCallback}) => (
    <View style={styles.todo}>
      <Switch value={task.checked} onValueChange={onChecked}/>
      <Text>{` ${task.id}: `}</Text>
      <TextInput value={task.task} onChangeText={text => onEdit(text)}/>
      <Button onPress={onDelete} title="delete" />
    </View>
)
```

The parent component will be in charge of passing the callbacks to the children. Here is the example of how to toggle a todo. The complete code is available in the [full app](https://snack.expo.io/@rrobbes/todo-app). 

```typescript
const TodoList = () => {
    const [todos, setTodos] = useState<Task[]>([])
   
    // code ommitted, see full version 
    
    const toggleTodo = (todoId: number) => {
      // we check/uncheck a todo by returning a new todo with the boolean state checked reversed
      const toggle = (todo: Task) => {
          return {...todo, checked: !todo.checked}
      }
      
      // we update the todo list state
      // we replace the old todo with the toggled todo
      // all the other todos are kept the same
      const newTodos = todos.map(todo => {
          if (todo.id === todoId) {
              // we found the todo to change, we toggle it
              return toggle(todo)
          } else {
              // this is another todo, we don't change it
              return todo
          }
       })
      // we update the state to be the new todo list
      setTodos(newTodos)
    }

     // some components ommitted from rendering
     // notice how we use the id to identify each todo in the list
     // and pass that information in the callback
    return (
        <ScrollView>
          {todos.map(todo => (
            <Todo
              key={todo.id}
              task={todo}
              onDelete={() => deleteTodo(todo.id)}
              onChecked={() => toggleTodo(todo.id)}
              onEdit={(text) => editTodo(todo.id, text)}
            />
          ))}
        </ScrollView>
    )
}
```

## Thinking in React
There is a nice resource on React's website on [how to define an application with React](https://reactjs.org/docs/thinking-in-react.html), with a nice step-by-step example. Briefly, the steps are:

- Break the UI in a component hierarchy (who would have guessed?). To determine if a component should be broken down in sub-components, a good guide is the single responsibility principle: one component should do one thing only. A component that does more than one thing should probably be split into several sub-components.
- Build a static version of the UI in React (rendering a fix data structure). This can be helpful to separate thinking about design aspects from thinking about the state and interactions with the application.
- Identify the minimal state needed (and what part of the data can be simply computed, not kept as state). State is needed to represent aspects of the application that will change over time, but it should be kept to a minimum.
- Identify where the state should live (i.e., which component should manage which state). Once you identify which state you need, it's important to place it correctly in the component hierarchy. In general, a piece of state should be placed in such a way that it can be passed as props to all the components that may need it. Thus the state should be put in the closest parent component of all the components that may need it.
- Add Inverse data flow (passing callbacks as props to the components that need it). If state is shared between components, then children may need to notify the parent of a state change. This is called inverse data flow, since the usual data flow (via props) is from parents to children, not children to parents. To do so, a **callback can be passed by a parent in a prop**. The child component can execute it with the relevant information. This is what is done with buttons, text inputs, switches. It can also be used in your components.

