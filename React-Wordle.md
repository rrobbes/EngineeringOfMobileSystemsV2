# Assignment 2: Wordle, in React Native

The goal of this assignment is to implement a second version of the Wordle game, but this time, using React Native. The basic rules of the game are the same (you can consult the previous assignment for a refresher). The only difference is that the interface of the game will not be based on console input and output, but the react native paradigm, where a tree of UI components is rendered, and a user interacts via touch. The user interactions trigger callbacks, which, if they change state or props in the tree of components, cause re-renders. This can cause some differences in behaviour, particularly with the input of the guess: 
- The original game (https://www.nytimes.com/games/wordle/index.html) displays letters as soon as they are pressed, but without any color. 
- A delete button can be used to delete letters from the guess, if it has not been validated.
- An enter button is used to validate the guess.
- If the guess is not valid (not a word in easy mode), the letters are colored in red, and the guess can be completely or partially deleted before re-validating it.
- Only when the guess is validated (through a special key or button), are the letters colored to show how accurate the guess was.

The other differences for this assignment are:
- A custom keyboard needs to be rendered on screen. This should not be a standard input keyboard component. A standard keyboard from the React Native library will not work, since it has too many keys and we need to color the keyboard.
- We can not use input commands for additional functionality. Instead, the app will have several screens:
- A first screen, the "setting screen" will allow the user to select the type of game: easy, hard, or double (see below). It will also allow to select the word to play with (either random, or a number). There is a button to play the game according to the options selected, which causes the application to go to the "game screen". Below, the screen will also display the statistics (as before, the statistics are not persistent). Given how react native apps work, there is no need for an equivalent to the quit command, or the help command.
- A second screen, the "game screen" will be the actual game. That screen will show the board on top, and the virtual keyboard at the bottom. It will have a button to go back to the "setting screen" as well.

## Dordle (only for CS students)

This application allows to play an additional variant of the game, called dordle or  double wordle. An example of it can be found here: 
https://zaratustra.itch.io/dordle

In this version, you have a total of seven guesses (one more), but you have to guess two five letter words:
-  All guesses are shared between the two words. 
- There are two boards that are displayed, but a single, shared keyboard that adds guesses to both boards at once. 
- Once a word has been guessed, the board for this word does not change anymore (the keyboard only changes the boards that have not been finished yet).
- The letters on the keyboard can take two colors, one for the first board, another for the second board, so their background should be split in two as needed.
- Once one of the boards is guessed, the background of the keyboard only shows the clues for the remaining board.
- The settings screen should display the statistics for both kind of games independently (normal wordle and double wordle).
- If you feel adventurous, you can try additional variants (quordle, octordle, sedecordle (!)). These variants are interesting to try more advanced layouts (e.g., on a tablet, for a better use of space). 

## Prerequisites

To do this assignment, you only need to know basic knowledge of React Native:
- Basic components (Buttons, Views, etc)
- Basic layout and styling of components (knowing how to arrange components in rows and columns will be useful)
- Conditional rendering to display multiple screens (using the more complex React Navigation library is not necessary for this assignment).

## Previous assignment

You also need most of the functionality of the console-based wordle game (e.g., how to figure out the status of each guess). In case your solution was using the principles of functional programming (small functions, no global variables), then it should be possible to reuse part of it. In case you did not hand in the first assignment, or your solution was not complete, or it proves hard to reuse, there is a backup solution. Thus you have two options:

- You can either reuse functionality from your previous assignment.
- Or, you can choose to start from the assignment solution, which is available here:
https://replit.com/@RomainRobbes/WordleSolution#index.ts


## Style considerations

As with the previous assignment, style considerations are important. General things to watch are:

- Keep your components small and reusable.
- In particular, React Native components can have state, unlike in pure functional programming. However usage of state should be limited to the strictly necessary. Having more than a handful of state variables (or very complex state objects) in a component is usually a sign that the component is too large.
- Keep your style separate from the code of the components via style sheets.

You should separate, as much as possible, the logic of the application from the UI. You can see an example of an application with a functional core independent of the UI here:
https://snack.expo.dev/@rrobbes/2048

Lines 1 to 191 are the "logic" of the game, independent of the React Native UI. The remaining lines (lines 192 to 310) use the functional core and render its state with react native components (in this particular case, the React Native code is somewhat more complex, since it defines animations and use a few more advanced APIs, so don't worry about this---although this might be useful if you would like to learn about how to define basic animations).

# Handing in the assignment 

The assigment should be done using the Expo Snack platform (https://snack.expo.dev). If you have not done so yet, you should create an account. I am asking for an Expo Snack solution, **not an independent application**, because of the large number of assignments that I have to process (setting up multiple projects takes a lot of time). 

**For the assignment you need two submit at least two files**:

- A zip file with the code that you submit (use the "download as zip" option of expo snack). 
- A text file with **a link to the snack**, as well as a statement that says whether you are a Business Informatics or a Computer Science students. This is because CS students have an additional part of the assignment to do (Dordle).

**The assignment should be handed in by Sunday, May 22nd**.
