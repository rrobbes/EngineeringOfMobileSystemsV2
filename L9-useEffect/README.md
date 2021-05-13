# Lab 9: Side effects, and the useEffect hook

We will practice the use of side effects, with the useEffect hook in React Native components, by extending a version of the contact list example, which queries a web service. This version displays an initial list of users, and can perform additional queries when the list is close to the end (using paging).The notes of the class on this [can be found here](https://github.com/rrobbes/EngineeringOfMobileSystemsV2/blob/main/15-Effect/README.md). 

The application is [in this snack](https://snack.expo.io/@rrobbes/user-list-api-with-useeffect-and-paging). Of note, it runs much better on a native device than on the web (I'm not sure why, perhaps the expo web client has some imcompatibility), so do run it on your mobile device if at all possible. Starting with the snack, expand it in the following ways.

## Refining queries

First, we will extend the code so that we are a bit more flexible in the queries we make:

- Add a text field to specify the seed to be used when a query is made. Using a different seed makes the server return different results for otherwise identical parameters (it is a random seed, like for a random number generator). Be mindful of how this change causes queries to be re-run (or not).
- Add a second text field (if possible with an alphanumeric keyboard, check the documentation), that, similarly, lets you control how many results you get per page.
- Change the code to simulate a slow query (waiting for some time, check on the async class for that), and add a "loading data" indicator (it can be a simple text, or a fancier component if you find one---but don't focus on this for now.). 

## Optimizing queries 

Now, we will try some "optimization" of the queries. If we assume it is expensive to query the server (lots of computation required on the server, lots of bandwith), we are not very "smart": we make queries that return very large objects, yet most of the time we display only a subset of the data (e.g., the name and an image). In reality, we only need this data when we are browsing an individual user (clicking on one).

- Do two queries at two different times. First, to populate the scrolling list, do a "lightweight query" where you get only the name and image of each user. Only when the app user selects a user to get their details, will the app execute a "heavyweight query" that gets all the data for a given user. To do this, given how the randomuser.me API works (it might be different with other APIs) you will need to keep track of the seed and page a user is in. It might be useful to refer to the previous lab and the randomuser.me API documention for details of how to do a "lightweight query".
- Notice how when you go back after you get the details of a user, the entire list is reloaded? This is because the list component is unmounted and a new one is mounted, and it causes a lot of additional queries. Add a way to keep the data for the list around, either some kind of primitive cache, or making sure the component that handles the user list data is not unmounted when rendering a detailed user component.
- Notice how when you do a "heavyweight" query, you have to query data for multiple users. If you browse two users that are close together in the list you might query for their data twice. Try to cache the data that you are querying for the "heavyweight" query, in case the app users browses two users close in the list. To better see this, make the "heavyweight" query slower by waiting for a few seconds.
- Finally, assume that doing a "heavyweight" query is not expensive per se, but it is very slow. In that case, we would not want to do it when we browse a user, since it will be take too long. Rather, we would want to do the heavyweight query immediately after the lightweight query, so that the request is executing while the user is scrolling about the list. Implement this.

### Custom Hooks

Finally, in case you have more time: based on the information in the page [how to fetch data with react hooks](https://www.robinwieruch.de/react-hooks-fetch-data), implement a custom hook for data fetching, that handles the state for data loading and error handling, and use it in the components. To test it, extend the queries to simulate random waiting times, and occasional (random) errors when loading the data.
