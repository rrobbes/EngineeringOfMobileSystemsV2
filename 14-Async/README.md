# Asynchronous code in Javascript

Many operations can take a potentially long time to execute. For instance, if you connect to a web service, a lot of steps need to be executed (by more than one device!):

- Building and executing an HTTP Request (with the necessary parameters, etc--more on this later)
- Connecting to a server and sending the request (connecting through several devices accross the internet, this may involve powering up the wi-fi or cellular radio in the device)
- The request goes from client to server over the network (sending data through several devices)
- The server receives the request, and decodes it (parsing the request and the parameters)
- The server needs to execute some code to get the data needed to reply (the request may be arbitrarily complex)
- The response must then be built, and sent back to the client (same as step 1, on the other side)
- The response travels to the client over the network (same as steps 2 and 3)
- Finally, the client decodes the request and acts on it (same as step 4)

This is a lot of work, and this can take a lot of time (it can take even more time if the connection is slow at some point). It can even fail (for instance, if the connection fails, or if code on the server fails). 

There are many more examples of this kind of requests, that can take a lot of time to execute, and that may also fail. Categories of these include:

- Data-intensive actions, such as accessing the file system to load a file (which might fail if the file is not present or has been deleted). Even if succesful, parsing the data in the file might be lengthy, and fail if the data is not well formatted.
- Doing expensive computations, such as applying a filter on a high-definition picture, working on audio data, etc.
- Any action that requires user input will take at least the time for the user to react to the request. This can can be arbitrarily long: the user may have just put the phone down, or they may need time to perform the requested action (e.g. asking the user to take or select a picture). The action may fail if the user does not do what is requested (e.g. the user does not want to take a picture in the end). 
- Some actions require a specific kind of user input: a **permission** to access sensitive data or device functionality. Examples include access to a user's contacts or calendar, or access to device sensors such as device location. The mobile OSes require explicit user input for some of these, which might be denied.
- Getting data from sensors on IOT devices or phones might require some time, even after a permission is granted. The sensors might need time to calibrate, or the data source is not trivial (e.g., a location sensor needs to connect to wifi or GPS).

All of these actions may require a potentially unbounded amount of time, and they may fail. Thus, for all of these actions (and more), it would be unwise to suspend execution and just wait for the results. We have seen what happens when we render a very large list of items: the UI is blocked. In these cases, we often want that the costly activity happens "in the background", so that we can do something else while we wait. 

Moreover, if several of these operations need to be executed, we may not want to execute them sequentially unless absolutely required. For instance, in the first example, we could want to start connecting to the internet at the same time that we are building the HTTP request, so that we can do something while we wait. If we have several requests to web services to do, we can start one while waiting for the results of another. Unfortunately, there is no way to know ahead of time how long each request will take in order to schedule them efficiently.

What we want, is for code to execute **asynchronously**, in the background, so that we are notified when something interesting happens (such as a result or a failure). This would solve the scheduling issue: we can start several tasks in the background, and then wait for one or all of them to finish. 

In JavaScript, the solution is not to return the result, but to **promise** to return the result in the future. Other languages may use other mechanisms, such as threads to more explicitely manage concurrency. Promises and the async/await extension (seen next) have some different tradeoffs, focusing on ease of use and of reading and reasoning about the code. 


## What is a promise?

We have seen a way to have code executing in the background already: callbacks. We can send functions to the UI, through the React native UI bridge. These functions will be executed when the user interacts with the UI, and we will be notifed because our callback is executed. This takes care of a lot of issues already. For instance, we can have several callbacks that can be called, depending on what the user does; some might never be executed at all. So, callbacks naturally handle part of this uncertainty issue.

The only issue with this paradigm is that it does not scale very well when we need to do sequences of actions in this way. An additional complexity is when we need to specify callbacks when an action fails (for instance, we want to connect to a server, but we don't have an internet connection). If we have several such steps, the complexity can add upIn these cases, we end up with the "callback pyramid of doom":

```javascript
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log('Got the final result: ' + finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);
```

Promises solve these issues by allowing the user to write asynchronous non-blocking code, and also permit chaining callbacks and error handlers, in order to orchestrate a sequence of asynchronous actions (such as getting data from a webservice).

In this paradigm, a function that execute asynchronous code does not block execution before returning a result. Instead, it returns "a kind of result" **immediately**. What it returns is a `Promise` object: a "promise" that the result will arrive at some point, or a notification that something went wrong.  

We will be notified that the code executed with a callback, similarly as before. In the meantime, we can schedule other actions, that do not depend immediately on the results (promise chaining, seen next, allows us to specify things that depend on the result). 

### building a promise

The most common case is that you will be using a function that returns a Promise, but it's also useful to know how to implement such a function. A Promise is actually a special Javascript object [see documentation here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), that can have three states: 
- Pending, the initial state: we don't know what the result is.
- Fulfilled: a final state with an associated value, when the operation completed succesfully.
- Rejected: a final state for when the operation failed. It can be associated with an reason for the failure (e.g., "file not found", "permission denied"). 

The promise always starts in the "pending" state. A Promise takes code (possibly synchronous, unreliable, and lasting a long time) to execute, and when this code has executed, it provides two callbacks: one for when the code executed normally (switching to "fulfilled" state), and another for when the code failed (switching to "rejected" state). In either case, when either callback is called, the Promise is "settled".  A simple example that succeeds ("fulfilled") would look like this:

```javascript
const myPromise = new Promise( (resolve, reject) => {
    // execute code here and
    // depending on the outcome, call either "resolve" or "reject"
    // here we execute some code that waits before succeeding
    setTimeout( () => resolve(42), 3000)
})
```

An example that fails ("rejected") would be: 

```javascript
const myPromise = new Promise( (resolve, reject) => {
    // execute code here and
    // depending on the outcome, call either "resolve" or "reject"
    // here we execute some code that waits before succeeding
    setTimeout( () => reject("oh no, there was an error!"), 2000)
})
```

### Typing a promise 

Typescript provides a generic type definition for a promise: `Promise<T>`, where T is the type of the expected result when the promise is fulfilled (the argument of `resolve`). When the promise is rejected, the object returned (as argument to `reject`) is an object suitable for this purpose, such as an Error object, or a string. Internally (although you shouldn't access it directly), the Promise is a simple javascript object with two properties: a `state` ("pending", "fulfilled", or "rejected"), and a `result` (which is `undefined` while the state is pending).

### Subscribing to the result of a Promise

Promises are not meant to be used directly (don't access the internal data), but rather with callbacks. We specify a callbacks with the `then`, `catch` or `finally` methods. 

- `Promise.then(callback)`: executes the callback passed in as its argument after the previous promise block returns. `then` can also take a second argument, which is a callback to execute when an error occurs. 
- `Promise.catch(callback)`: executes the callback if any of the previous promise blocks has an error. It is equivalent to `then`, but with an empty first argument
- `Promise.finally(callback)`: executes the callback regardless of whether the promise failed or not. The callback does not have the information of the result, it has no arguments at all. 

This is similar in spirit (not yet in form) to how exception handling works in Java, with the "try/catch/finally" blocks.

Let's see some examples:

```javascript
// this is asynchronous code that "does nothing"
// it just blocks execution for a time
const wait = s => new Promise(resolve => setTimeout(resolve, s * 1000));

wait(4).then(() => console.log("done waiting 4 sec!"));
wait(2).then(() => console.log("done waiting 2 sec!"));

```

## Promise chaining

An important property of promises is that they can be **chained**, to describe a process that takes several steps.
This is because `then()` returns a new Promise object, on which we can call another `then`. So, we can do:

```javascript

const wait = s => new Promise(resolve => setTimeout(resolve, s * 1000));

wait(3)
    .then(() => console.log("waited 3 sec!"))
    .then(() => wait(2))
    .then(() => console.log("waited 2 sec!"))
    .then(() => wait(1))
    .then(() => console.log("waited 1 sec!"))
```

We can also get notified when a problem occured. For instance, suppose that a function crashes:

```javascript

const wait = s => new Promise(resolve => setTimeout(resolve, s * 1000));

const crash = () => {
    throw new Error("crash!")
}

const withError = () => {
    wait(1)
        .then(crash)
        .then(() => console.log("waited 1 sec!"))
        .catch(() => console.log("ooops!!"))
        .then(() => console.log("did we recover?"))
}
```

The catch() callback will be executed.

The idea is to split a process in several step, such as the webservice scenario above.



## Alternative to Promises: Async/await

Even if Promises are nicer than the "callback pyramid of doom", the code is still somewhat verbose. In ES 2017, an alternative was introduced: the `async` and `await` keyworkds. This allows us to write async code “as if” it were synchronous. It is still non-blocking. 

A function can be marked as `async`, and it will automatically be asynchronous and return a Promise. To do so, just use the `async` keyword:

```javascript
const asyncArrow = async () => { ... }
async function asyncFunc() { ...}
```

Within an async function, you can `await` the value of another async function or Promise, by using the `await` keyword.

```javascript
const asyncFunc = async () => {
    const x = somePromise()
    const y = somethingElse
    return await x + y
}
```


Note that async functions and the await keyword are still non-blocking. Async/await looks much more synchronous, but it is asynchronous from then on.

What happens if an error occurs? When using async/await, we should use a try/catch block, which works similarly as it would in Java:

```javascript
const awaitError = async () => {
    try {
        const w1 = await waitReturn(1)
        const oops = await crash()
        console.log(w1)
      } catch(error) {
        console.log("something happened: " + error.message)
      }
}   
```

