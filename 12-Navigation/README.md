# Navigation
This lecture covers how to use navigation in a react native app. 
## What is navigation?

Since a mobile app is usually rendered on a small screen, its UI can not usually show all the functionality of an app in a single place. Mobile apps tend to define an app as a set of **screens**, each screen showing a specific and cohesive subset of the app's functionality.  For instance, a contact management app could have the following screens:
- Login screen
- Settings screen
- Contact List screen
- Add Contact screen
- Show Contact detail screen
- Search Contact screen

Navigation covers how you can move between screens in an application. So far, we've done this manually, using state to handle navigation, such as:
```javascript
const ContactApp = () => {
    const [showContacts, setShowContacts] = useState<boolean>(false)
    // ...

    return 
        (<View>
        {showContacts?
        <ContactList>:
        <AddContact>}
        </View>)
}
```

But if we have many ways to navigate an application this is not going to work very well. With 5 or 6 screens, this approach will start to become inconvenient.

A second problem appears, for which we will see more partial solutions now, and more complete solutions later: how do we pass state across screens?

## React native navigation

Android and iOS have different APIs to do different things. This is what React Native unifies behind a single API, hinding these differences. This is relatively straightforward when the differences are minor.

For navigation, the approaches taken by iOS and Android are extremely different. The "navigation patterns" between screens on iOS and Android are very different too. [The React Navigation library](https://reactnavigation.org/en/) is extremely useful to hide this complexity and the large differences between the two platforms behind a unified API. React Navigation also handles the transitions withing screens, such as sliding from right to lect to go back to the previous screens.


To install the library in your application you will need to install a variety of packages. With expo snack, it is enough to import these. and expo snack will install them automaticaly. If you have installed expo on your machine, [consult the documentation](https://reactnavigation.org/docs/getting-started)



## Major concepts in React Navigation

A **navigator** is a component that implements a navigation pattern, such as tab-based, stack-based navigation, or drawer-based navigation. A tab-based navigation pattern shows a tab bar at the bottom of the screen, allowing the user to choose which component to display at anytime. A stack-based navigation pattern is similar to a switch-based navigation, but also allows backtracking in time. A drawer-based navigator allows to temporarily show a component (usually with things such as settings) over the other components, by swiping from the edge of the screen.

A navigator has one or more **screen components**, associated with **routes**. In the component hierarchy, a navigator will be the parent component of the screens. The route will determine which screen is shown.
Each route has a **name**, which uniquely identifes the route (it is usually unique across the app).  A route can have **parameters**, which allow information to flow from one screen to the next. 

The screen component is a React component that is rendered when the route is active. The component directly passed to the navigator can be set up with a variety of options, such as a screen title, possibly icons, etc. It contains a regular react component.

Finally, navigators are **composable**: navigators are components, which can be children of other navigators. This allows us to implement nested hierarchies of navigators, such as a stack-based navigator inside a tab-based navigator (don't go too far in this way, though! you don't want your application's interaction to be too complex).



## Stack Navigator

A stack navigator provides history of the navigation, implemented as a stack of the successive screens that the user navigates to. It is then possible to "go back" to previous screens in the history, as they are in the stack. Note that **the previous screens are kept in memory and are kept mounted**, so that their state is maintained (such as the position in a long list). 

The Stack Navigator follows the navigation conventions and animations on iOS and Android:
- In iOS, a new screen slides from right to left. To return to the previous screen, a left to right gesture can be used. 
- In Android, a new screen fades on top of the old one. To return to the previous screen, the back button is used.

### Manipulating history

The Stack Navigator also provides API methods to manipulate the history, such as pushing and poping items from the stack. For instance, suppose you are implementing the checkout part of a shopping cart application. You could implement checkout as a series of steps, each step being a screen:
- Enter delivery address
- Choose payment method
- Enter payment details 
- Enter billing address
- Confirm order

It makes sense to go back in the history while completing the order (e.g., to change the payment method). However, once the order is confirmed, it is not possible to change it anymore. So, the "confirm order" step, when completed, could remove the previous screens from the navigation history.


### A First example

The following code instantiates a stack navigator, with several screens:

```typescript

const StackNavigator = () => {
  const Stack = createStackNavigator()
  
  return (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{title: "Home"}} />
      <Stack.Screen 
          name="Screen 2" 
          component={Screen2} 
          options={{title: "Screen2"}} />
      <Stack.Screen 
          name="Screen 3" 
          component={Screen3} 
          options={{title: "Screen 3"}} />
      <Stack.Screen 
        name="Settings" 
        component={Settings} 
        options={{title: "Settings"}} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}
```

Of note, each of the screen components will not receive standard props. Instead, they will receive a **navigation** prop (and a **route** prop), which can be used to trigger navigation operations. This is an important difference with regular components. We will see shortly how to make those components behave more like regular components. For now, let's see how to navigate from one screen to the next. by looking at the definition of a component:

```typescript
// we will worry about typing this later

const Screen3 = ({navigation}) =>  (
    <View>
        <Text>Screen number 3</Text>
        <Button title="Go to screen 2" onPress={() => navigation.navigate("Screen 2") } />
        <Button title="Go to home" onPress={() => navigation.navigate("Home" )} />
    </View>
)
```

As you can see, it suffices too mention the route name as a parameter to the navigation operation to navigate to another screen.

In order to send information between screens, we can pass a "param" object alongside the route:

```typescript
  <Button title="Go to screen 2" onPress={() => navigation.navigate("Screen 2", {name: "Some name}) } />
```

This is a standard javascript object, which can have as many properties as you wish. On the receiving end, we use the route props:

```typescript
const Screen2 = ({navigation, route}) =>  {
    
    const {name} = route.params
    return (
    <SafeAreaView>
        <Text>Screen 2</Text>
        <Text>Hello, {name}!</Text>
        <Button title="Go to back" onPress={() => navigation.goBack()} />
        <Button title="Go to screen 3" onPress={() => navigation.navigate("Screen 3")} />
    </SafeAreaView>
    )
}
```

There are more navigation operations, [see here](https://reactnavigation.org/docs/navigation-prop/). In particular, a stack navigator can **push** routes on the stack of routes.




### Customizing Screens
Notice how the screens have title bars now. This is because having screen titles is even more useful when the history can be very deep. Right now, the title bars are empty, but this can be customized. A lot of properties can be defined by defining a `options` object, beyond the title. Some options that can be set are: 
- headerTitle
- headerStyle
- headerTintColor
- headerLeft
- headerRight

And a full list is here: [https://reactnavigation.org/docs/screen-options/]

The libary takes care of a lot of small details that users care about, such as what to do when a screen title is too long. Shared options can be put in a screenOptions prop for the whole navigator.




### Customizing header options

 The title of a screen can be customized: an arbitrary component can be put there. We even put interactive components such as buttons. We can also customize this header further by setting the headerLeft and headerRight properties, these can be functions that return components (this is a bit inconsistent with the title, for which a function is not needed). 
 
 However, for interactive components to be interesting, they need to have access to information. To allow this, note that `options` does not need to be fixed. Instead of an object, a function taking as arguments a `props` object, containing a `navigation` object, a `route` object. This function can then return an object describing the navigation option values to apply to the screen. Since `navigation` is passed as a parameter, this can be used to put navigation buttons in the header bar, or to pass data though parameters.

They are regular components, but rendered in the title bar, not the screen itself. The title could also be any component, such as a button.

```typescript
//customizing the header properties
<Stack.Screen 
          name="Home" 
          component={Home} 
          options={({route, navigation}) => ({
                  title: "Home Screen", 
                  headerLeft: () => <Text>left</Text>, 
                  headerRight: () => <Button title="screen 3"  onPress={() => navigation.navigate("Screen 3")} />})} />

//the title varies with the parameters passed to the screen
 <Stack.Screen 
          name="Screen 2" 
          component={Screen2} 
          options = {({route}) => ({title: route.params.name})} />
```

## Higher Order Components

Functions such as `createStackNavigator` or `createBottomTabNavigator` are **higher-order components**. They are functions that return a React component, usually wrapped with additional behaviour. 

This is a bit similar to **higher-order functions**, such as `map` and `filter`. The React documentation has [more on Higher-Order Components](https://reactjs.org/docs/higher-order-components.html).




## Tab Navigators

Tab navigators have tabs, and like stack navigator, they don't unmount the hidden screens. 

There are several implementations of the tab navigator.  The default tab navigator shows a tab bar at the bottom. Importantly, some of the navigation options differ from the stack navigator, as you can not have such an extended support of history. The simplest history option, goBack(), works on tab navigators, it brings you back to the first tab (but you can configure it).

To create it, it is similar to the Stack Navigator, but you also have the option to provide icons to the tabs. If we compose navigators, we can have a Tab navigator that defines routes, in which other navigators can be defined, such as stack navigators.


## Screens versus normal components

While adding navigation is very useful, to extend the application, we don't want to reduce the reusability of the components. If we have a component that directly uses navigation, this means that it can not be reused in another context, where navigation is not available, or the navigation possibilities are different. Consider the following example, where a list of items is shown in one screen, and two additional screens allow to see details of an item, and to add new items (a generic pattern, here simplified to the maximum).


```typescript

const List =  ({navigation, route}) =>  {
    const [list, setList] = useState<int[]>([1,2,3,4,5])
    const onAdd = (n) => setList([n, ...list])

    return (
      <View>
      {list.map(n => <Button title={"select " + n} onPress={() => navigation.navigate("Number", {num: n})} />)}
      <Button title="add new number" onPress={() => navigation.navigate("AddNum", {onAdd: onAdd})} />
      </View>
    )
}


const Number =  ({navigation, route}) =>  {
    const {num} = route.params

    return (
      <View>
      <Text>You selected {num}</Text>
      </View>
    )
}

const AddNumber = ({navigation, route}) => {
    const {onAdd} = route.params
    const choices = [6, 7, 8, 9, 10]
    return (
       <View>
        {choices.map(n => <Button title={"add " + n} onPress={() => { onAdd(n); navigation.navigate("NumList")}} />)}
        </View>
    )
}

const StackNavigator = () => {
  const Stack = createStackNavigator()
  return (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="NumList" component={List} options={{title: "Number List"}} />
      <Stack.Screen name="Number" component={Number} options = {({route}) => ({title: "chosen: " + route.params.num})} />
      <Stack.Screen name="AddNum" component={AddNumber} options={{title: "Add a number"}} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}
```



In short, we would like our application to support navigation but have our main UI components be unaware that navigation is used. How can we do this?

The answer is to use **screen components**. Screen components are used only to deal with the complexity of navigating between screens, and fetching data from other screens, or sending data to them. They isolate the presence of navigation from the other component.

In React Native, components receive information from their parents throught their props. As long as their parent sends them the right information, they "don't care" what kind of component the parent is. 

With screen components, each screen of the application is a tree of UI components, as before. But only the root component of the tree has knowledge of the navigation. This component can:
- Fetch data from the navigator, through screenProps or parameters, and pass this data to its children as regular props.
- Define the navigation operations that may be needed (navigating to other screens, going back, etc).
- Hide these navigation operations inside callbacks. These callbacks can then be passed to the components as regular props, as we did before.

The screen component should have no or very little actual functionality. Its only role is to act as a "translator" between the navigator and the normal components.

## Callbacks between screens

Earlier, we managed state in a parent component, wich would pass callbacks to the child components. We can use the same callback mechanism for screens. The only difference is that screens can pass callbacks via params, instead of props (for now).

To do callbacks between screens, each screen will receive the original callbacks, instead of the components. Each screen will define new callbacks, that will execute the original callbacks, and also execute the necessary navigation operations. Thus, the screens wrap the navigation operations so that the original components are not affected. Operating in this way, the two Components **do not need to know that anything changed if the navigation changes**. They can be used as they were used before. Only the screens have to be changed. See the example below:



## Typing the navigation

It can be easy to make mistakes when navigating to a route if there is no type checking, as the route is defined as one of several strings. Likewise, screens can expect parameters, but they also need to be typed to reduce errors. There is more information to do this [here](https://reactnavigation.org/docs/typescript/). Unfortunately, Expo snack does not support this, as it is (at the moment) using an older version of TypeScript, that can not be changed. However, a local installation of Expo should work here. Typing involves listing the available routes and expected parameters (using "undefined" if no parameters are expected for a given route) in a type definition. Then type definitions for a stack or tab navigator can be imported, and parametrized (since they use generics), with the type definition of the screens. For instance

```typescript
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';

// listing all the routes available and typing their parameters
type ApplicationRoutes = {
  Home: undefined,
  Screen2: {name: string},
  Screen3: undefined,
  Settings: undefined,
}

// instantiating the concrete type for a route
type HomeScreenProps = StackScreenProps<ApplicationRoutes, "Home">
const Home = ({navigation}:HomeScreenProps) =>  {
// ...
}

// instantiating concrete type for a route with paramStr
type Screen2Props = StackScreenProps<ApplicationRoutes, "Screen2">
const Screen2 = ({navigation, route}:Screen2Props) =>  {
// ...
}
```