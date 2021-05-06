# Lab 8: Working with Promises, Async/Await, and Web services

In this lab, we will practice how to query a web service with the fetch API, and parsing the data (which is very often in JSON format), to extract the relevant data. We will not yet integrate this in the UI of our application, as we have not seen how to do this yet. We will limit ourselves to display the results in the console. 

### On documentation

Another skill that we will practice today is the ability to find information in documentation. As we cannot cover every possible Javascript and React native packages (there are over a million), every possible web service (I can't even estimate how many there are), or even every component in the Expo and React native base library, the ability to autonomously find information is very important.

To practice this, here are starting points in the documentation that you can use to learn how to make a query to a web service, with the Fetch API (note that to ease the task, I am providing you the API to use---a further task is to **choose** which API to use among several options, such as the [axios API](https://axios-http.com)):

- [Overview](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Fetch Basic Concepts](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Basic_concepts)


We will use as basis the randomuser.me web service. This is the web service that I used to get the data for assignment 1. Similarly, this web service's API is documented, [here is the documentation](https://randomuser.me/documentation).

### Tasks 

To get started, open [this expo snack](https://snack.expo.io/@rrobbes/async-practice).

Then do the following tasks, refering to the class and to the API documentation for fetch and randomuser.me :

- Using the randomUser.me API, fetch a single random user, and display it in the console. Do this using Promises, not async/await
- Do the same task, but using async/await instead of promises
- Change both functions so that you only log in the console the name of the user, not the entire user (this means getting the full object and processing it, not using the API to limit the data it sends, which is done below).
- Using either Promises or async/await, fetch a list of 15 users to display in the console.
- Add a text field to the App UI, to enter the number of users you would like to fetch.
- Use the randomUser.me API to filter the fields that the API returns: return only the name, location, and picture fields, for 20 users.
- Use the randomUser.me API to filter the results according to nationalities, returning a list of 50 users, but only users living in either Germany, Spain, or Switzerland.
- Add a button that starts both previous requests at once, in parallel.
- Add a button that starts both previous requests at once, but in sequence.
- Add a button that starts both previous requests at once, and displays the results of the first one that finishes.
- Add a button that starts both previous requests at once, waits for the results, and displays all of them together.