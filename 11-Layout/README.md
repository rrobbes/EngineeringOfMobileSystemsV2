# More on layout, styling, and scrolling



## Conditional rendering for different sizes

There are various sizes of mobile displays with a wide range. It is thus useful to have an application that can adapt from small phones to larger tablets. We can use conditional rendering for that. If the size of the screen is less than a given dimension, we can use a certain layout of components; if the size if larger, we switch to another. To get the size of the screen, we can use the `useWindowLayout` hook. It returns the size of the display window, and re-renders the component if the size of the display window changes (e.g., rotation from portrait to landscape).

In particular, in cases where we have a list of items, it is a common idiom for applications to have a "phone-sized" layout where the list is displayed, and selecting an item switches to rendering details of a single item. On the other hand, a "tablet-sized" layout would show a list of items in a column on the left. Selecting an item would then display it on the right side of the screen. This is a common idiom, one example would be for email applications. 

Note that the usefulness of these goes further. Depending on the application, the "tablet-sized" layout could be used for a large-screen phone when held in landscape. Similarly, if a tablet is able to show two applications at once (usually side by side), then it may make sense to display it using "phone-sized" layouts, if available.

In order to go beyond the default column-based layout, the flexbox layout is useful (see the links below).



## Scrolling and lists in React

Suppose we have many items (such as users). To show them, we will need more than one screen. In a webpage, a scroll bar shows up automatically if the content is larger than the screen. In a mobile device, the behaviour is different: given the size of the screen, applications need to limit scrolling if possible, so that most of the UI is accessible at any time. So, in mobile, scrolling must be handled explicitely, in order to give maximal control to the developer.

Often, scrolling is needed when there is a large list of often similar elements to render. We will see several way to define components that handle scrolling, some of them made to explicitly handle lists. The options are:

-  [ScrollView](https://docs.expo.io/versions/latest/react-native/scrollview/), is the simplest.
- [FlatList](https://docs.expo.io/versions/latest/react-native/flatlist/)
- [SectionList](https://docs.expo.io/versions/latest/react-native/sectionlist/)

### ScrollView

This is the most basic scrolling view, which enables you to display more elements than the screen allows. If the elements contained are larger than the space allocated, then the ScrollView allows you to scroll to see the hidden elements. By default in RN, these elements would simply be invisible. An important note here is that to do so, the ScrollView needs to render **all of its children** before rendering itself. This may not be what you want.

As we have seen earlier, objects rendered in lists in React need to be rendered with a `key` property, which allows to uniquely identify each object. Not doing that results in a warning, because this can make React's diff algorithm inefficient. For instance, instead of inserting an object at the beginning of the list, it may instead modify all the objects in the list, resulting in poor performance.

If the list of users is large, it takes some time to render the UI. In fact, performance will degrade linearly with the length of the list. This is because ScrollView renders **all** the elements. That's a lot of elements: there are several times as many UI elements as there are users. This happens even if some of the elements will never be displayed on the screen (e.g., if the user never actually scrolls). They still have to be rendered, which wastes a lot of work.

### FlatList

FlatList uses a virtualized list to increase performance. In essence, FlatList only renders what's on the screen. It will not render the elements that won't be seen. It also has additional features, such as header, footers, horizontal mode, columns ...

The FlatList takes data as a prop, and a RenderItem callback function. That way, it will only execute the RenderItem function when needed, for the elements it needs to display. 
The Rows can be recycled (similar to Android's RecyclerView): instead of re-creating objects, a view that is no longer visible can be reused to show a new object. Invisible views may be unmounted. So components with state can be problematic. Thus prefer pure Functional Components in such lists, (or use external state store, more on this later).

A ScrollView that renders all the elements would look like:

```javascript
<ScrollView>
{users.map(user => <User user={u}/>))}
</ScrollView>
```

becomes

```javascript
<FlatList 
    data={users}
    renderItem = {object => <User user={object.item}/>} 
/>

// or with can use destructuring:
<FlatList 
    data={contacts}
    renderItem = {({item}) => <User user={item}>} 
/>
```

The item that renderItem takes has more properties than the item: there is an index and a separator that it can take. See the API: [renderItem](https://docs.expo.io/versions/latest/react-native/flatlist/#renderitem). 

Notice that now the FlatList is much faster! It's only rendering roughly ten items at once (all that are visible, plus maybe a few more that are just outside the window to make scrollign smoother). It renders the other items only as the user gets to them. An item that is not displayed will never be rendered. Essentially, flatList is "lazy". That's another concept that is found in some functional programming languages, such as Haskell, that has [lazy evaluation](https://en.wikipedia.org/wiki/Lazy_evaluation), in contrast with [eager evaluation](https://en.wikipedia.org/wiki/Eager_evaluation).

Regarding keys, FlatList uses by default the key property of the objects that it renders. But this behaviour can be changed, by passing another function in the `keyExtractor` prop.

### Updating the FlatList

As other components, FlatList only updates if its props are changed. Suppose we added a sort function to our app, such as:

```javascript
// sorting via last names
const sort = () => setUsers(users.sort((a, b) => a.name.last < b.name.last))

//...
<Button title="sort" onPress={sort/}>
```

This will not work as expected. The problem is that array.sort **mutates** the array. So, if we only consider object references, the state is the **same state** as before. From FlatList's point of view, the prop did not change, as the reference did not change. This can be a hard to track bug!

Thus, we would need to create a new array, for instance like this, with the spread operator:

```javascript
sort = () => {
    newArray = [...users]
    setUsers(prev => newArray.sort((a, b) => a.name.last < b.name.last))
}
```

### SectionList

This is just like a FlatList, but with sections. See the [docs](https://docs.expo.io/versions/latest/react-native/sectionlist/)

The data for a section looks like this:

```javascript
const data = [
    {title: "section title", data: [obj1, obj2, obj3]},
    {title: "section 2", data: [obj4, obj5]},
    {title: "section 3", data: [obj6, obj7, obj8]}
    ]
```

Each section can provide a different renderer (`renderItem`), if that is needed. Each section has header, that is rendered as well, with a `renderSectionHeader` prop, another function. For instance:

```javascript
<SectionList
    renderItem={this.renderItem}
    renderSectionHeader={this.renderSectionHeader}
    sections={[{
        title: 'A',
        data: this.state.contacts
        }]}
/>
```

As with a FlatList, each `data` is still a list. It just works like the FlatList, and also does lazy loading to render quickly, even for large lists.


## Further reading links: 

- https://reactnative.dev/docs/flexbox
- https://snack.expo.io/@rrobbes/contact-filtering-example
- https://reactnative.dev/docs/scrollview
- https://reactnative.dev/docs/flatlist
- https://reactnative.dev/docs/sectionlist
- https://reactnative.dev/docs/virtualizedlist

