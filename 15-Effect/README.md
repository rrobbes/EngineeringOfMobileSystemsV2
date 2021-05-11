# Handling side effects in React 

We have seen how to work with Promises and async functions. This is crucial to do work that can be done in the background, such as making queries to web services. Now, we will see how we can use the `useEffect` hook to integrate this kind of code in React components, allowing them to do things such as use advanced expo API that require access to sensitive information, and to display information coming from outside the app, such as from a server or from the file system.

## Reminder: The rules of hooks

The rules that need to be followed are:
- **Don't call hooks inside conditionals or loops**. For performance reasons, React relies on the hooks being called **in the same order** accross each re-renders (they are in a sort of queue). 
- **Only call hooks from React components, or custom hooks**. Hooks are attached to a component, so they must be called from inside a component, directly or indirectly. Do not call hooks from regular javascript functions.
- **hook names should start with `use`**. This is more of a convention, but if you define a custom hook, prefix its name with `use`, so that developers (and the IDE) can recognize it's a hook. This allows the IDE to check if the other rules are followed. Avoid this prefix for other function names.

## The useEffect hook

`useEffect` allows you to perform **side effects** in your functional components. A side effect is any observable effect besides the value returned by a function. Example usages would be fetching data from disk or the internet, sending data to the file system or a web service, setting up subscription to event handlers, getting permission to access sensitive device information, and any **async** function in general. 

The idea of `useEffect` is declare a side effect as a function that will be executed **after the component renders**. Indeed, since we never know know when (and if) an async function will return a result, we can not wait for the result of an async function while rendering the component. Thus, we decouple rendering the component from the execution of side effects and async functions. 

Importantly, we are often executing these side effects inside a component, because we are expecting information that will be shown in the component. Thus, it is not obvious how we can "bring back this information" to the component, since the effect is executed after the render. The answer is that, whenever we get information that we want to display in the component, **we send this information to the component's state**. As you know by know, if we change the state or props of the component, it will be re-rendered. Thus, we can:

- render the component
- execute the side effect after component renders
- if data comes in, we change the state of the component
- this causes the component to re-render, with the new information

There are a couple of subtleties:
- `useEffect` is called by default **after each re-render**. You can see how this can cause an "infinite loop" of sort: render -> effect changes state -> re-render -> effect changes state -> re-render -> effect changes state -> ... To handle this, `useEffect` allows to specify when the effect should be run through a dependency array.
- Not all side effects can be simply executed. Some side effects also need to be "cleaned up" after they are no longer useful (e.g., when the component is unmounted and disappears from screen). For instance, if an effect subscribes a component to events, we would like the componenent to be unsubscribed when we unmount it, to avoid sending event updates to a component that is no longer visible. `useEffect` can also specify a cleanup function to be executed when it is time to clean up.

With this functionality, the `useEffect` hook provides support for actions that would be supported by a variety of life cycle methods in class components (that we have not seen): initialization (`componentDidMount`), recomputing when needed (`shouldComponentUpdate`), or cleanup (`componentWillUnmount`). 

## Working with useEffect

The `useEffect` hook is a function, that takes two arguments:

- A function, which is the effect to run. The function either returns nothing, or a callback to perform cleanup.
- An optional dependency array, which specifies when the function should be run.

Importantly, since `useEffect` may return a callback function, `useEffect` may not be async (else it would return a Promise of a callback).

### The dependency array

The dependency array argument specifies when the effect should be run. In it, we put all the pieces of data that the effect depends on; any change to these pieces of data will cause the effect to run again. There are three scenarios:

- **No dependency array**: the effect is run **after each component render**, no matter what. React assumes that the effect depends on **everything** inside the component. 
- **An empty dependency array**: the effect is run **only once**, when the component is rendered first. React assumes the effect depends on **nothing** inside the component. This is used for component initialization.
- **A dependency array with variables in it**: the effect is run **if any variable has changed** between two renders. React assumes that the effect depends on any variable specified there. For instance, a component rendering a user profile would fetch detailed profile data any time the user ID changes. Importantly, **forgetting to specify any dependency will cause the effect to not run as often as expected**.



## useEffect for initialization 
The simplest form of `useEffect` takes as argument a function, that will be executed **after the component is rendered** for the first time. The effect is allowed to change the state of the component, which will re-render it. For instance, this is very often used to obtain permissions.


Some of the operations in the expo APIs access sensitive data, such as pictures, contact, or the location. Applications need to ask the user for permission to access these. The user has every right to deny said permissions. Once a permission is denied, it is pretty hard to get it back (users have to manually enable them back). This means that it is important to explain clearly (and convincingly) why the app needs specific permissions.

Asking for permissions is an async operation (as it requires user interaction). Components that require permissions specify it in the documentation. For instance, to access the camera one would consult [the documentation](https://docs.expo.io/versions/latest/sdk/camera/#cameraisavailableasync-boolean). In this case, the pattern is the following:

```typescript
export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    const askPermission = (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })
    askPermission();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity

```

Note that the code is a bit more complex since the permission is an async operation, but we can't make the effect async.


## Handling cleanup

To allow for effect cleanup, `useEffect` allows to specify a cleanup function. If cleanup is needed, the effect function returns a cleanup callback function. Otherwise, it returns nothing.  This function will be executed **when it is time to cleanup**. 

At first glance, one could think that the cleanup function could be passed as a third argument, but this would have issues. In particular, if the cleanup function needs data from the effect, it would need to be stored in the component state. By returning a callback, this data can be kept in the scope of the effect only. Imagine a component that logs a user in, and gets a session ID. When the component is unmounted, the user would log out, passing out the session ID. We can either store this in the state, or just keep this in scope of the effect and the cleanup function.

When is it time to cleanup? By default, it is:
- When the component is unmounted
- Before the effect is re-run

For instance, a subscription ([example from here](https://reactjs.org/docs/hooks-effect.html#example-using-hooks-1)) could look like: 

```typescript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

### useEffect on prop/state change

Some components need to perform a side effect when their props and state change. For instance, a component that shows user profiles:

```javascript
const UserProfile = props => {
    const [profile, setProfile] = useState("user data")

    const getProfileFromWeb = userID => {
        // fetch data for user based on userID
        userData = // ...
        setProfile(userData)
    }

    useEffect(() => {
        getProfileFromWeb(props.userID)
    }, [props.userID])

    return // render the user profile
}
```

`useEffect` accepts as second argument an array of "watched" object or properties. If any one of the "watched" objects change when the component is re-rendered, the effect is re-executed (the cleanup of the previous effect will execute too). If none of the "watched" objects in the array have changed, the effect will be skipped. In the example above, the effect will re-run only if the `userID` prop changes. This makes sense, because it means we want to display a new profile. Note that **it is very important to list all the important properties in this array**: if some are missed, the effect may fail to run when you expect it to run. Essentially, every piece of state or prop that is referenced in the effect should be put in the array to be "watched".

**Running an effect only once** is possible. In that case, the second argument can be set to an empty array. This ensures that the array will never change. In that case, the effect will be run when the component is mounted, and the cleanup will be performed when the component is unmounted.



### Multiple useEffects

It is allowed to use multiple effects in a single component. This is even recommended. It allows to better separate concern (e.g. one effect for loading things from disk, another effect for checking a webservice periodically, etc). Further, this allows to better specify when each effect should be run. Each effect can "watch" different properties and update at different paces, instead of recomputing all effects at once. For instance:

```javascript
const LoadAndPing = props => {
    const loadDataFromDisk = ()) => // ...
    useEffect(() => loadDataFromDisk(props.fileName), [props.fileName])

    const pingWebService = () => {
        fetch(props.url).then( //... 
    }
    
    useEffect(() => {
        // check the web service every 30 seconds
        const interval = setInterval(pingWebService, 30 * 1000)
        // return method to do cleanup on unmount
        return () => clearInterval(interval)
    }, [props.url])
}
```

[More on useEffect](https://reactjs.org/docs/hooks-effect.html)

