# Assignment 3: React Native Wordle/Dordle, advanced version

The goal of this assignment is to extend the second version of the Wordle game, written in React Native, to use more advanced parts of the Expo API. In particular, we will focus on APIs that allow to interact with servers (to send or receive data), and APIs that use device sensors. Many of these APIs require the usage of *async* operations, which in React Native requires the usage of the *useEffect* hook. Some of the tasks may require the use of *Permissions*, which is also an Async operation. The assignment consists of several tasks, described below.

## Previous Assignment 
This assignment requires an existing version of Wordle/Dordle as basis. As with the second assignment, you can either use the previous assignment, or the solutions to assignment 2, which are available:
- Wordle: https://snack.expo.dev/@rrobbes/wordle-solution
- Dordle: https://snack.expo.dev/@rrobbes/dordle-solution


## Group Work
The assignment can be done either alone, or in groups of two or three people, **from the same degree** (all Computer Science, or all Business Informatics). Importantly, **the size of the assignment varies with the number of people involved**. If the assignment is done in a team of two or three people, then more tasks need to be done than if the assignment is done by a single person.

Each task has a number of points assigned to it, roughly equivalent to difficulty or amount of work needed. To get full marks, you should implement at least the required number of points, less than that will reduce the grade.

For Business Informatics students:
- One student should implement 4 points 
- Two students should implement 8 points
- Three students should implement 11 points (note: this includes extending Dordle, so it requires starting from the Dordle solution above)

For Computer Science students:
- One student should implement 5 points
- Two students should implement 10 points
- Three students should implement 14 points (note: this requires using the quite advanced Firebase API, so this is for ambitious teams)

# The tasks

The following is the list of tasks to choose from.

## Wordnik integration (mandatory, 2pt)

Use the wornik API to get more data about the words of the game. The API is here, and can be used for free if you make less than 100 calls per hour:
- https://developer.wordnik.com/docs

With this API, implement the following:
- Show the definition of the word to guess after winning or losing.
- Add a "clue" button that displays the type of the word (noun, verb, adjective, etc)
- Add a "desperate clue" button, that displays the top example from the wordnik API (without the word in it, obviously!). This button is only available when there is one guess left. 

## Persistence (1 pts)

Right now, the statistics of the game are reset every time the application is started. This defeats the purpose of statistics. Use the **AsyncStorage** API to make the statistics persistent (https://docs.expo.dev/versions/latest/sdk/async-storage/). Notes:
- If the statistics you had were too basic (just number of wins and losses), you should expand them to also record the number of attempts taken to win a game, and display this information.
- The UI should also provide an option to reset the statistics.

## Haptics (1 pts)

Use the Haptics API (https://docs.expo.dev/versions/latest/sdk/haptics/) to provide Haptic (vibration) feedback of some actions. Some events that require Haptic feedback are:
- Starting a game
- Winning the game
- Losing the game
- Entering an invalid guess

Feel free to add more haptics if you think it is necessary.

## Sharing (1 pts)

Wordle became famous because of the way it allowed people to share their game play. For instance, the following game:

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wordle_196_example.svg/1920px-Wordle_196_example.svg.png" width="250">

Would be shared as:

![Wordle Share](https://upload.wikimedia.org/wikipedia/commons/8/8b/Wordle_Emoji_Screenshot.png)

The sharing format is actually a text string, using Unicode Characters to display colored squares. For instance, this "yellow square" character (https://emojipedia.org/large-yellow-square/).

The goal of this task is thus to share your game, using the [Expo share API](https://docs.expo.dev/versions/latest/sdk/sharing/), to a variety of services of your choice (e.g. social media). If you implemented Dordle, then the sharing should also work with it.

## Challenges (2 pts)

Implement a UI to issue a challenge to your friends. The idea is the following: 
- The user picks a word from the list of eligible words (or two, for Dordle). 
- The application builds a Javascript object that represents the type of game to play and the word or words to guess (this depends on how your application works)
- This object is converted to a string url, and encoded as a QRCode, for instance using this package: https://www.npmjs.com/package/react-native-qrcode-svg
- The QR Code is displayed on screen, a second user can scan it with their phone camera 
- This opens the application on the other phone, which receives the data, creates the game, and starts it
- If the game is won, the user gets the option to issue a challenge back

## Advanced Wordnik integration (2 pts)

This extension deepens the Wordnik integration. The game does not use the pre-made lists of words to select words or to check if they are eligible. Instead:
- The word to guess is either the "Word of the day" or a random word of a minimum length of 5 (but can be longer)
- The game supports words that are longer than 5 character. 
- Longer words are allowed more guesses: the number of guesses is equal to the number of letters plus 1, with a maximum of 10 for a single word.
- Guesses are checked by wordnik: any word that has a definition is allowed.
- Guesses that are shorter than the word are allowed, if they are valid.

## Dordle: eternal edition (2 pts)

This does not use additional APIs, but should be fun. This is a new game playing mode, that starts like Dordle. When a word in a dordle is completed, it is replaced by a new random word. The user picks three of the existing guesses of the replaced word to "keep". The game resumes with the two remaining words. The game continues in this fashion until it is lost. The goal is to 

## Advanced challenges (4 pts, for ambitious teams!)

This is the same idea as the challenge, except that it does not require the users to be in physical presence. The application uses the Firebase APIs (https://docs.expo.dev/guides/using-firebase/) to:
- provide each user with an account
- a random user gets the opportunity to issue a challenge to the other users. 
- If the user declines, another random user is picked, until a user accepts
- When a user accepts to issue a challenge, they choose the type of game, the starting word (or words), and the duration of the challenge. 
- The challenge is sent to all the users in the platform (e.g., using the messaging API: https://firebase.google.com/docs/cloud-messaging)
- When the challenge ends, the user that guessed the words correctly in the least tries wins. In case of ties, the fastest user wins.
- The winner gets the option to issue the next challenge (if they decline, a random user is picked)


# Handing in the assignment 

The assigment should be done using the Expo Snack platform (https://snack.expo.dev). If you have not done so yet, you should create an account. I am asking for an Expo Snack solution, **not an independent application**, because of the large number of assignments that I have to process (setting up multiple projects takes a lot of time). 

**For the assignment you need two submit at least two files**:

- A zip file with the code that you submit (use the "download as zip" option of expo snack). 
- A text file with **a link to the snack**, as well as a statement that lists the team members, says whether the team is made of Business Informatics or a Computer Science students, and specifies the tasks that were implemented.

**The assignment should be handed in by Tuesday, June 14th**.


## Style considerations

See assignment 2.
