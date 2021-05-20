# Persistence, and A Tour of the Expo API documentation

As part of its platform, Expo features a lot of APIs, a list of which can be seen [in the Expo documentation](https://docs.expo.io/versions/latest/). In particular, we will focus on the [Expo SDK](https://docs.expo.io/versions/v35.0.0/sdk/overview/), which contains libraries to access useful functionality on a mobile device, such as Sensors, Location, Battery, Camera, Maps, and many others.

These functionalities were either developed from scratch by the Expo team, or are high-quality open source libraries carefully selected, tested, and maintained by the Expo team. In both cases, one of the goals is to unify the functionalities of the different operating systems as much as possible. In case this is not possible, the differences are clearly documented.

To use them, the most important thing is to simply read the documentation. However, there are a few general things to consider.

## Reminder: useEffect, async functions, and permissions

A lot of the APIs that are included with Expo rely on permissions (as they access sensitive information), or other functionality that relies on async functions. For all of these, remember to use the useEffect hook, which allows you to render a component initially, execute a callback after rendering (e.g., asking for a permission, fetching data), which may then change the state of the component, causing it to re-render. See the [previous class on useEffect](https://github.com/rrobbes/EngineeringOfMobileSystemsV2/blob/main/15-Effect/README.md).

Of note, several APIs have subscriptions to event handlers. In these cases, it is important to **unsubscribe** when the component is unmounted or the effect is stopped. This is one of the use cases of the "cleanup functions" of `useEffect`. For instance, here is how to subscribe and unsubscribe to an event handler of when the app goes in the background/foreground:

```typescript
useEffect(() => {
    // the effect sets up the event subscription
    AppState.addEventListener('change', _handleAppStateChange);

    // and returns a "cleanup function" that unsubscribes the event handler
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);
  ```
  
  The complete example (with the actual even handler) is [here](https://docs.expo.io/versions/latest/react-native/appstate/)

## Degrade Gracefully

For many of these APIs, acquiring some resources may not always succeed. Users may decline permissions. Their hardware may not support all the latest sensors. They may be in a location where the internet is slow, or not available. For all of these reasons, if possible, do not rely fully on a feature to be present, but try to have a "plan B" for when the most advanced features are absent. The application may be less convenient to use, but it should hopefully still be usable.

## Be kind on the battery and the network

Many of the advanced APIs are power-hungry. E.g., getting a precise location activates the GPS, which takes a lot of energy. Do not use these too often! 

Note that the [Battery API](https://docs.expo.io/versions/latest/sdk/battery/) allows you to check the battery status of the device. This information can be useful to alter the behaviour of the application. Your application should try not to consume too many resources, particularly if the battery level is low.
The battery API can:
- Tell the battery level of a device
- Tell if the device is in normal mode, power saving mode, charging, or full
- Allow you to subscribe to battery events, so that a callback is executed if, e.g., battery is low.

Furthermore, the [NetInfo API](https://docs.expo.io/versions/latest/sdk/netinfo/) allows you to check out the type of connection (none, wifi, cellular, unknown). Callbacks can also be registered to be informed of changes in the connection type. This can be useful to adjust the application's behaviour, e.g., operations that consume large amount of data might be reserved for when the connection is over wifi, rather can cellular; or, simply informing the user that the application may have reduced if there is no internet connection available.

With these two informations, it is possible to schedule expensive operations in a more user-friendly manner. For instance, an application that needs to send large amounts of data or perform complex operations may try to schedule these operations for when the device is connected to wifi and charging, to minimally impact the user. 

In addition, there is additional guidance on building [applications that can work when offline](https://docs.expo.io/guides/offline-support/).

## Background activity

Another way to reduce adapt to different situations is to differentiate between when the application is in the foreground and when the application is in the background. A useful APIs in this context is [AppState](https://docs.expo.io/versions/latest/react-native/appstate/), with which you can be notified of when the App is goes in background or in the foreground (more on this below too).  For instance, the app may turn off or reduce other callbacks while it is in the background. Examples of adapting behaviour are:

- the app won't need detailed location data if it is in the background
- the user don't need to see up-to-date information if they may not even read it. So an app that consults a web service for incoming data may stop doing it, or do it less frequently
- on the other hand, the app may want to disply user notifications if important events occurs while it is in the background

The following APIs are useful to manage background activities:

- [TaskManager](https://docs.expo.io/versions/latest/sdk/task-manager/), which you can use to schedule long-running tasks, or tasks that run periodically in the background. 
- [BackgroundFetch](https://docs.expo.io/versions/latest/sdk/background-fetch/) builds up on TaskManager for a common use case, which is periodically fetching data, even when the app is in the background. The API allows to specify how often these tasks should be executed.

# Persistence

The expo API provides several modules related to persisting the state of your app. 


## Memory in mobile OSes, and implications

Mobile devices have a relatively limited amount of storage, memory, and battery. While this is not as true today, it was very important in the beginning, and had important constraints in the design of mobile OSes. In particular, neither Android or iOS have **swap space**. 

Desktop OSes have swap space: when the applications need to much resources, the OS can decide to move some of their memory to swap space (essentially, dumping the memory contents on the hard disk), to free some RAM for other applications. This allows to keep a lot of applications open at the same time, at the cost of slowdowns when applications that were swapped out of memory are re-activated.

In mobile, this does not work since both storages and memory are constrained. Moreover, writing and reading large quantitie of data from permanent storage (e.g., the memory of an entire process, which can be hundreds of megabytes) regularly would be harmful for the battery life.

Thus, mobile OSes have a different way of handling memory resource issues. When memory runs low, **they can terminate applications**. You may have noticed when multitasking that occasionally, applications appear to relaunch, not resume the execution. Essentially, **your application may be terminated by the OS at any time**, particularly when it is inactive. 

When an application is inactive, goes into the background, or is about to be terminated, the OS will notify the application. The application can respond by saving its most essential state, so that it can resume execution when relaunched. In this case, it is a responsability of the mobile app developer to:
- Determine what is the smallest amount of state that is necessary for the app to relaunch
- Make sure that this smallest amount of state is persisted when it should

An additional advantage of this strategy for the OS, is that it forces developers to choose the state they want to persist. This results in much smaller space demands than swapping, that needs to write down to disk possibly the entire process space of an application. An application that needs hundreds of megabytes of RAM may acctually have a state, that, when explicitely persisted, takes a few hundreds of kilobytes only. 

For instance, in the contact app, if we wanted to "save" a list of 1,000,000 randomly generated contacts (I know, this is absurd!), we don't need to actually save them. The only information we would need to save is the random seed that was used to generate the random contacts. We can go from several megabytes to just a few bytes.

A good moment to persist important data from your App is when it becomes inactive (unfortunately, you will not receive a callback when the app is about to leave without "ejecting" from Expo). The OS normally does not usually terminates the active application; rather it will usually terminate inactive applications in the background to free RAM for the active application. The React Native library AppState (see above) can be used to receive notifications of when the App goes in the background and foreground, through callbacks. 

## AsyncStorage

[AsyncStorage](https://docs.expo.io/versions/latest/react-native/asyncstorage/) is simple key-value store (e.g., to store JSON objects) that is global to the app. Note that it is not encrypted. See [SecureStore](https://docs.expo.io/versions/latest/sdk/securestore/) if you need to store sensitive data. The library is meant to be a drop-in replacement to the localStorage API available in web browsers.

AsyncStorage is the simplest way to store state that is encoded as small objects. Very large objects, or binary objects (e.g. images) should rather be stored in the file system, with the URI to the file stored in AsyncStorage (or SQLite). 

The API of AsyncStorage is very simple: several variants of `get` and `set` methods that take a string as key. Since the key-value store is global, it is easy to overwrite a given key with another, if two parts of the app use the same string as a key. This is why, beyond simple usages, the API recommends to use an abstraction layer on top of AsyncStorage, rather than the AsyncStorage library. For instance, state management APIs such as Redux, or Mobx, can use AsyncStorage as a backend to persist their stores from one session to the next. **Note that for the final project, using AsyncStorage is sufficient**. 

It is possible to build relatively simple abstractions on top of AsyncStorage to make it quite convenient to use. For instance, the following is a **custom hook** that behaves exactly like `useState`, but also persists its data. 

```typescript

// a variant of useState that persists the state
// in AsyncStorage. When the component is mounted,
// the state is loaded. When the state changes, it is
// written in persistent storage
type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
type SetterArg<T> = React.SetStateAction<T>

const usePersistentState = < T extends {} >(initial: T, key: string): [T, Setter<T>] => {
  const [state, setState] = useState<T>(initial)

  // useEffect with empty array is executed only once
  // when the component is mounted
  // here we read the persistent state 
  // when the component is mounted
  useEffect(() => {
    const readState = async () => {
      try {
         const item = await AsyncStorage.getItem(key)
         console.log("Read item : ", item)
         if (item !== null) { 
            setState(JSON.parse(item))
         } else {
            console.log("item was null")
         }
      } catch(error) {
          console.log("error: ", error)
      }
    }
    readState()
   }, [])

  // writeState both sets the state, and persists the data
  const writeState : Setter<T> = (item: SetterArg<T>) => {
    const value = item instanceof Function ? item(state):item
    console.log("writing state", value)
    AsyncStorage.setItem(key, JSON.stringify(value))
    setState(value)
  } 

  // we return writeState, NOT setState
  return [state, writeState]
}

```

The most complex part of this custom hook is not the code itself; rather, it is how to make it work fine with TypeScript (hence the generics). The custom hook can be used exactly like `useState`, but it will write to permanent storage every time the state is changed. Note that this may not be what you always want, particularly if the state changes very often. In this case, it would probably be better to return a triplet of items: 
- the state
- a function to set the state,
- another function to explictely persist the state 

## FileSystem

With the [FileSystem API](https://docs.expo.io/versions/latest/sdk/filesystem/), every app can access a local file system, that is visible only to the app itself, and not from the outside. Every app has access to a specific set of directories, where it can read and write files:
- `FileSystem.documentDirectory`:  `file://` URI pointing to the directory where user documents for this app will be stored. Files stored here will remain until explicitly deleted by the app. Ends with a trailing /. Example uses are for files the user saves that they expect to see again.
- `FileSystem.cacheDirectory`: `file://` URI pointing to the directory where temporary files used by this app will be stored. **Files stored here may be automatically deleted by the system when low on storage**. Example uses are for downloaded or generated files that the app just needs for one-time usage.

In addition, other directories in the OS can be accessed read-only. For instance, if the app has permission to access the camera roll, it can read files from that specific directory. See [The Camera Roll documentation](https://facebook.github.io/react-native/docs/cameraroll.html#getphotos) for more on this.

## SQLite

[SQLite](https://docs.expo.io/versions/latest/sdk/sqlite/) is a lightweight, filesystem-based implementation of an SQL database. It allows to create, access, and alter SQL tables, using the SQL language. The database will be created in the app's document directory, e.g. `${FileSystem.documentDirectory}/SQLite/${name}`.

Several databases can be created if needed. A `Database` object represents a connection to the DB, and `Transaction`s can be created to consult the DB, by interpreting SQL statements (defined in strings). The `Transaction` may return a `ResultSet` object. 

## Firebase

[Firebase](https://docs.expo.io/guides/using-firebase/#using-expo-with-firestore) is an advanced suite of tools that includes two cloud databases. The advantage over local storage is that the data can be centralized and shared between several instances in the application. The two databases are a Realtime database (where instances of the application can receive notifications when data changes in the cloud), and a Store for larger documents.  

## State evolution and updates

If your app is succesful, it is likely that you will want to update it over time. When adding new features, it is possible that you will need to change the data format. For a contact management app, we could think of the following changes:
- Version 1 would be a very basic contact management app, where contacts have names and local phone numbers.
- In version 2, contacts have a profile picture, which is a new property which contains a link to a (filesystem or web) URL of an image
- In version 3, the application supports international phone numbers, so the phone number changes to `{phone: {prefix: "+39", number: "1234567"}}`
- In version 4, emails are added, and names are changed first to a different format: `{name: {first: "james", last: "bond", title: "Mr."}}`

Users that upgrade are at risk of losing data if this is not handled properly. To make matters worse, there is no guarantee that users will install all the updates! It is possible that some users will upgrade directly from version 1 to version 4, or go from any older version to the latest version.

One strategy here is to store the app version with the data. This allows to detect version mismatches after upgrading the app, when the data is loaded.
The naive approach is to erase the data and start over, but that is of course very unsatisfactory. A possible solution is to call a "migration method" when a version mismatch is detected. There is actually a rather elegant pattern to handle version migrations from an arbitrary starting point, using a switch statement:

```typescript
migrate = (state, oldVersion) => {
        let newState = state
        switch (oldVersion) {
            case 1: 
                console.log("migrating from 1 to 2, adding default pictures")
                newState.contacts = newState.contacts.map(c => ({...c, picture: defaultPicture}))
            case 2:
                console.log("migrating from 2 to 3, restructuring phone numbers")
                newState.contacts = newState.contacts.map(c => ({...c, phone: {prefix: "+39", number: c.phone}}))
            case 3:
                console.log("migrating from 3 to 4, restructuring and adding emails")
                newState.contacts = newState.contacts.map(c => ({...c, name: convertName(c.name), email: "update.me@please.com"}))
        }
        return newState
        
    }
```

The "beauty" of this switch statement is that it is **not using break**, so that the code will execute the next blocks too. This way, a user that is on version 1 will execute all the code in the method, performing the 3 conversion steps, while someone that is on version 3 will only execute the last block.


# A partial tour of the Expo API

## Delegating to other applications

A very common pattern in mobile applications is to delegate some functionality to system applications instead of re-implementing it. This allows to reduce the size of the application. In this case, the application will cede control to another application. Examples include switching to the web browser or the email application to browse the web or to send an email. The expo API provides a variety of ways to delegate to other applications.

## Linking
The base mechanism for this relies on URLs. Each URL has an address, and a scheme that describe the type of URL (e.g. "https:" is a scheme, that is associated with a web browsing application, the "mailto:" scheme is associated with an email client, the "tel" or "sms" schemes, etc). The [Linking API](https://docs.expo.io/versions/latest/sdk/linking/) handles both [outgoing links](https://docs.expo.io/guides/linking/#linking-from-your-app-to-other-apps) (from your app to other apps), and [incoming links](https://docs.expo.io/guides/linking/#linking-to-your-app) (from other apps to your apps). Such links can contain a path to a resource, as well as parameters. Creating outgoing link is pretty simple, potentially requiring only the `Linking.openURL()` function. Incoming links are more complex as they require to set up and register a specific URL scheme for your application (which makes it not usable with the Expo Snack website, you need to install Expo for this to work), as well as defining where the resources point to and what the parameters are, and defining event handlers to handle receiving a link. However, if this effort is spent, this can be very convenient, as the links can point to a specific part of the application (e.g., a specific screen), and can send data to the application. 



## Using OS components in the application 
It is also possible to have a closer integration of the functionality in the application, should this be needed. Expo provides specific components to handle major functionality:
- [WebBrowser](https://docs.expo.io/versions/latest/sdk/webbrowser/) opens a web browser as a modal window in the application, rather than switching to the web browser application.
- [AuthSession](https://docs.expo.io/versions/latest/sdk/auth-session/) uses the web browser to allow users to authenticate with a variety of services (e.g., Google, Apple). This is something to consider, instead of implementing authentication yourself, as this can be a lot of work.
- [WebView](https://docs.expo.io/versions/latest/sdk/webview/), which is a web browser that can be displayed as a component inside the application's UI, allowing a lot of control, such as intercepting URL navigation ([guide](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md)).
- [MailComposer](https://docs.expo.io/versions/latest/sdk/mail-composer/) shows a modal to compose an email, instead of switching to the mail client client.
- [MapView](https://docs.expo.io/versions/latest/sdk/map-view/) opens a MapView component, in which it is possible to mark locations of interest, via their coordinates (latitude, longitude). The map markers may even be rendered as arbitrary components, if needed ([more information](https://github.com/react-native-community/react-native-maps)). Can also be used in conjunction with Sensors and Location (next class).
- [Camera](https://docs.expo.io/versions/latest/sdk/camera/) embeds a camera view in the application, to take pictures, etc. Also used by other components, such as the [BarCodeScanner](https://docs.expo.io/versions/latest/sdk/bar-code-scanner/)
- [Document Picker](https://docs.expo.io/versions/latest/sdk/document-picker/) allows to browse files saved on the device to select them and send them to the applications. 
- [DateTimePicker](https://docs.expo.io/versions/latest/sdk/date-time-picker/) to pick a date.
- [ImagePicker](https://docs.expo.io/versions/latest/sdk/imagepicker/) provides access to the photo library; see also [MediaLibrary](https://docs.expo.io/versions/latest/sdk/media-library/) 
- [Sharing](https://docs.expo.io/versions/latest/sdk/sharing/) opens a share sheet to send files to other applications.
- [Audio/Video](https://docs.expo.io/versions/latest/sdk/av/) allows for audio/video playback. [Assets](https://docs.expo.io/versions/latest/sdk/asset/) and [FileSystem](https://docs.expo.io/versions/latest/sdk/filesystem/) may be useful in conjunction with this.
- [Notifications](https://docs.expo.io/versions/latest/sdk/notifications/) to handle local notifications (e.g. schedule a notification as a "reminder" at a later point in time), as well as **push notifications** from a server (e.g., when something important happens when the app is in the background, but has received new data). Note that it is quite possible that users decline to receive notifications (I very often do!), so do not depend on this to be always accepted.


## Accessing device data

A lot of device data can be accessed. Like many other APIs, these usually need specific permissions. Examples include:

- [Calendar](https://docs.expo.io/versions/latest/sdk/calendar/)
- [Clipboard](https://docs.expo.io/versions/latest/sdk/clipboard/)
- [Contacts](https://docs.expo.io/versions/latest/sdk/contacts/)
- In addition, a variety of [Sensors](https://docs.expo.io/versions/latest/sdk/sensors/) are available (see next lesson). 


## User Interaction

- [Localization](https://docs.expo.io/versions/latest/sdk/localization/): translate your UI in various languages. Very useful in multilingual regions. such as South Tyrol!
- [Haptics](https://docs.expo.io/versions/latest/sdk/haptics/): Used to provide haptics, such as vibrations as user interaction feedback.
- [GestureHandler](https://docs.expo.io/versions/latest/sdk/gesture-handler/): Used to define user interaction gestures, such as swiping. 
- [Font](https://docs.expo.io/versions/latest/sdk/font/): To use specific fonts.
- [Speech](https://docs.expo.io/versions/latest/sdk/speech/): To enable text to speech.
- [Animated](https://docs.expo.io/versions/latest/react-native/animated/): Can be used to define some animations for UI elements. These will be implemented as values that change over time (e.g., a component's x and y positions), causing the component to be periodically re-rendered.

An example of usage of Animations and GestureHandlers can be found in [this implementation of the 2048 game](https://snack.expo.io/@rrobbes/2048). Both use a special hook, the [useRef hook](https://reactjs.org/docs/hooks-reference.html#useref). `useRef` is similar to a useState hook in that it persists across re-renders. However, it does not cause the component to re-render when it changes.


## Graphics
- [Svg](https://docs.expo.io/versions/v35.0.0/sdk/svg/): Define React Native components that render vector images.
- [GLView](https://docs.expo.io/versions/v35.0.0/sdk/gl-view/): A low-level API to render 3D views. 


GLView is very low level. Higher-level APIs use it, and might be better for most developers:
- [Expo-Three](https://github.com/expo/expo-three) uses [three.js](https://threejs.org)
- [Expo-Processing](https://github.com/expo/expo-processing) uses [Processing](http://processingjs.org)

