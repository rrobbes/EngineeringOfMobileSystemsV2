# Debugging, Performance, Deployment

## Production vs Development mode

Your app can be in two modes: production and development modes. These options affect debugging and deployment. 
In production mode, your code will be minified, which affects application size and performance, but will contain less information useful for debugging.

The debugging tools are accessible only in development mode, via the development menu. Further, warnings are visible in development mode, but not in production mode.

Your app should be always deployed to users in production mode, but you should work on it most of the time in development mode. There are a few cases when it is useful to enable production mode when developing: to evaluate the actual app performance, and in the (unlikely) case some bugs only occurr in production.
Switching between development and production mode is simple: just change the switch that is displayed on the expo server web browser tab.

You can find more information about development mode and production mode [in the expo documentation](https://docs.expo.io/versions/latest/workflow/development-mode/).


## Debugging

To maximize your debugging possibilities, remember to do it in development mode. 

While the most basic debugging tool is the trusty `console.log()`, there are a several additional options available. First, the console object has more methods than just `log`:
- `console.error`: triggers an error, showing the big red error window with a stack trace. The stack trace can contain a lot of useful information to help you locate the bug.
- `console.warn`: shows the yellow banner at the bottom of the screen that can be expanded or dismissed. This is useful to show an important debugging information on screen, without stopping the app. It is also useful if you are developing a component that other people will use, and you want to make sure it is used correctly: in that case you can issue warnings if the component is misused (i.e., the props are not of the required types). Note that these warnings are hidden in production mode.
- `console.assert`: it is a basic assertion mechanism. It checks a boolean condition, and triggers an error only if the condition is false. This is useful for defensive programming: you can make sure that the arguments passed to functions match the expectations, and identify the issue and fail early in the computation, rather than in the middle of it (e.g., you can assert that an argument that is a number that should always be positive is indeed positive).

Moreover, the development menu that your app has contains valuable debugging tools. The first one is the "debug remote JS" option. This allows you to run a full-fledged javascript debugger on your javascript or typescript code. This is not really possible to have on a mobile device, because a debugger has a quite large and complex interface. 

What React Native does is the following. Remember that your App has two main threads: the native thread, which displays the UI components, and handles events, and the Javascript thread, where your code executes. Both threads communicate via messages sent over a bridge. The JS thread will tell the native threads which components to display, while the native thread will tell the JS thread what the user input is. Since these threads communicate via a bridge, it is actually **not necessary** that the JS thread executes on the mobile device. 

When the "Debug Remote JS" option is enabled, the JS thread is not executed on the device, but in the web browser that shows the expo server console. The bridge then sends the messages between two threads that can execute on different machines. A new tab opens in the browser, and the built-in developer tools in the browser (and the much larger computer screen) can be used to debug the app much more conveniently. 

There are two considerations to keep in mind:
- If you can, try to execute the app in a simulator, rather than a real device. This will reduce the communication latency between devices. Otherwise you may notice a delay between user inputs and actions if the network is slow.
- Prefer to use the Chrome web browser to execute the expo server, as it has the most mature development tools available. In chrome, when the new tab opens, you need to "inspect" the tab to launch the development tools.

The Chrome debugger has all the functionalities of a modern debugger. It can:
- Pause the application when an error happens, which allows you to start debugging right where the error happened.
- Pause the application when a breakpoint is reached, which allows you to verify hypotheses in the code (is this function actually executed?).
- Show the source code of the application. Note that the executed code can be different to the actual source code (it can be minified, or be raw javacsript instead of typescript). The debugger uses a "source map" to show the code location in the original code, rather than the  executed code.
- Allow to step through the execution, instruction by instruction, when a detailled understanding of what happens over time is needed.
- Display the state of variables and objects in scope. The UI allows to browse the contents of nested objects easily.
- Navigate the stack trace, to browse the scopes of the calling methods. 

One thing to be mindful about is that since Javascript uses a lot of callbacks for event handling, the stack trace can quickly reach code from the React framework, rather than code from your application. This is why it is sometimes necessary to identify where a callback is set up, and put a breakpoint there, to get more information on why a bug occurs.

There is ample more information on debugging. There is a [page in the expo docs](https://docs.expo.io/versions/latest/workflow/debugging/).

Moreover, if you use the Chrome development tools, their documentation is useful
- [The debugger](https://developers.google.com/web/tools/chrome-devtools/javascript)
- [Breakpoints](https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints)
- [Source maps](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps)
- [The debugger reference](https://developers.google.com/web/tools/chrome-devtools/javascript/reference)


## Performance

Optimizing the performance of your app might be sometimes important. The one thing to be mindful about is that optimizing code is not free: there are trade-offs involved. Performance optimization usually comes at the cost of increased complexity, which may result in more bugs down the line. In most cases, optimization is not worth the cost in complexity and maintanability. This is why you should find what are the bottlenecks of your application, and optimize only those (if needed). The bottlenecks are the parts of the code where your application spends most of its time, in a way that the user may notice.

One of the main performance issues with React apps is rerendering too often. There are a few ways that this can happen that you should be aware of.

Changes to props: some props change do not impact the component. But if they change, it will re-render anyways. The easiest "fix" is to not subscribe to unnecessary parts of the state. For instance, screenProps are shared for all the screens, even if most screens don't need them. Similarly, props that are passed along to sub-components may cause re-renders. 
- For both of these cases, state management may help performance (e.g. with Unstated, components can subscribe to specific containers, while Mobx uses the observer pattern for performance).
- As an optimization, shouldComponentUpdate could be implemented for a component. The component can then know that some props should not cause re-renders, and skip an update then. Anotother optimization in some cases is to inherit from React.PureComponent, not React.Component
- Ensuring that React diffs component with keys also impact the performance vs not having keys. So, if you have this warning, respect it!

Unnecessarily changing props: from the other side: if there are no reason to change the props, don't change them to avoid re-renders. For instance, if you are creating a new object literal and passing it as a prop during render, you will re-render, even if the prop is not really changing. If a callback is an arrow function that is created at render time, it will be different each time. Similarly, if the style of a component is inline (not using StyleSheet), it will be considered as a new object, and may cause unnecessary re-renders.

One quick way to notice if a component is re-rendering unexpectedly is to change its style at each render. For instance, we can give the component a random color or border each time it is rerendered:
```javascript
const colors = ["red", "green", "black", "yellow", "teal", "salmon", "turquoise", "orange", "white", "brown", "blue"]
const rand = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min
const randomColor = () => colors[rand(colors.length)]
const randomWidth = () => rand(45, 15)
const randomBorder = () => ({borderColor: randomColor(), borderWidth: randomWidth(), flex: 1})

const ScreenTwo = props => (<View  style={randomBorder()}>
    <Button title="1" onPress={() => props.navigation.navigate("RouteOne")} />
   <Button title="3" onPress={() => props.navigation.navigate("RouteThree")} />
      <Button title="back" onPress={() => props.navigation.goBack()} />
  </View>)
```

The in-app development tools have a few useful options related to performance. First, the performance monitor shows the number of frames per second that the app displays. If it stays above 60 frames per second, there is no need to optimize anything. Only if it goes below it, should optimizations be considered. Remember to test your application on a variety of devices, including lower-end devices, to get a sense of the performance on all kinds of hardware (keeping in mind that development mode does reduce performance). The performance monitor also tells you how many views are in the current screen, and how many are visible.

There is also a react native inspector available, that allows to see basic information on the widgets that are displayed (style, containment). These are not  performance related, but can be useful to fix "style bugs". An important aspect related to performance here is that the network activity is displayed. This allows to keep track of the activity, and make sure that not too many network requests are issued.

Finally, the Chrome dev tools can give much more information related to performance. They can:
- Record execution information of the app, and tell you how much time is spent in which methods. They contain comprehensive time-based visualizations of the app's execution. A "flame chart" provides a nice visual summary of how the time is spent.
- Gather memory usage of the application. This allows you to identify whether you are creating too many objects of a certain type. You can take a snapshot of the objects at a given point in time, or gather less information, but over time.
- There is also a panel for network requests, where ample information on the device's network requests can be found.

As with debugging, there is much more information available. For react, there is a [page on app performance](https://facebook.github.io/react-native/docs/performance).

And the Chrome tools have extensive documentation:
- https://developers.google.com/web/tools/chrome-devtools/rendering-tools
- https://developers.google.com/web/tools/chrome-devtools/evaluate-performance
- https://medium.com/@marielgrace/how-to-analyze-runtime-performance-google-devtools-99fda64c09cb


## Deployment

Once your app is "Ready for consumption", you can deploy it. There is a specific process for this, that is documented on the expo website extensively.
First, your app should be in production mode, to ensure it is as performant as it can be.

The first thing you can do is to publish it on Expo.io. App users will need to install the expo client to run your app. If you want to go further, you can also deploy it as a standalone app in the Android and iOS app stores.

### Configuration
Before deploying, you should check whether the metadata of your app is correct (e.g., the app name you entered when doing expo init). This information is contained in the app.json file. Other things to check are for instance permissions. By default, the app will use the same permissions as the Expo client. For instance, this include camera usage. If you don't need the camera, you can remove this permission. Find more information [here](http://docs.expo.io/versions/latest/workflow/configuration).

### Building the app
You then need to build the app as native packages for iOS and Android. Expo provides commands for this:
- expo build:ios triggers an iOS build on the expo servers. The app is uploaded there, and (eventually) an `.ipa` file is created.
- expo build:android triggers an Android build on the expo servers.  The app is uploaded there, and (eventually) an `.apk` file is created
- expo build:status tells you whether builds have finished. If they have finished, it returns a url with the file that you can download. You can them submit the file to the App stores.

### Over the air updates 

One great thing about Expo is that it supports over the air updates. Native apps need to be republished and reapproved on the app stores even for very minor updates. This can take days. An Expo app is essentially a "shell" than contains a javascript interpreter. If only the javascript changes, the app can re-download it from the expo server, without needing to update itself. You only need to publish it to Expo. 

This is very powerful, but also very dangerous: if you have a bug, you risk to affect all the users that have installed your app! So, test your app carefully.

The only changes that require resubmission to the app stores are the ones of the app metadata. This is why you should carefully check them in the first place!

Find more information on the app Expo publishing process here:
- https://docs.expo.io/versions/latest/distribution/building-standalone-apps/
- https://docs.expo.io/versions/latest/distribution/uploading-apps/
- https://docs.expo.io/versions/latest/distribution/app-stores/
