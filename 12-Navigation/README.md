# Navigation
This lecture covers how to use navigation in a react native app. The lecture is partially based this [CS50 lecture](https://www.youtube.com/watch?v=QHorNUuEXc0).

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

The libary takes care of a lot of small details that users care about, such as what to do when a screen title is too long.

Note that `options` does not need to be fixed. Instead of an object, a function taking as arguments a `props` object, containing a `navigation` object, a `route` object, and a default `options` object. This function can then return an object describing the navigation option values to apply to the screen. Since `navigation` is passed as a parameter, this can be used to put navigation buttons in the header bar, or to pass data though parameters.


### Adding buttons to headers

We can do this by setting the headerLeft and headerRight properties. We can put React Native components there, such as buttons. Since these buttons are defined in navigationOptions, they may have access to the navigation object, so their callbacks may cause navigations.

They are regular components, but rendered in the title bar, not the screen itself. The title could also be any component, such as a button.


## Higher Order Components

Functions such as `createStackNavigator` or `createBottomTabNavigator` are **higher-order components**. They are functions that return a React component, usually wrapped with additional behaviour. 

This is a bit similar to **higher-order functions**, such as `map` and `filter`. The React documentation has [more on Higher-Order Components](https://reactjs.org/docs/higher-order-components.html).




## Tab Navigators

Tab navigators have tabs, and like stack navigator, they don't unmount the hidden screens. 

There are several implementations of the tab navigator. Also, goBack works on tab navigators, it brings you back to the first tab. But you can configure it. The default tab navigator shows a tab bar at the bottom.

To create it, you need to define some routes, and that's pretty much it. If we compose navigators, we can have a Tab navigator that defines routes, in which other navigators can be defined, such as stack navigators.

