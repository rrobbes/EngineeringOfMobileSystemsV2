# Lab 6: Working on layout

The goal of this lab is to practice working with layout of varying sizes. You will take inspiration from the example seen in class for [contact filtering](https://snack.expo.io/@rrobbes/contact-filtering-example). You will apply it to the [flashcard app with deck editor](https://snack.expo.io/@rrobbes/flash-card-with-editor). 

Right now, the flashcard app only has a single-colum, "narrow" layout. To improve it, perform the following tasks:

- You will first adapt it to a two column layout, with an initial column that contains the "deck selector" component, and a second column that contains either the deck component (to review cards), or the "deck editor" component, to edit cards. Do this if the witdh of the screen is more than 450.
- If the screen is wide enough (more than, say, 900), then try a "three column" layout for the deck editor. The deck editor should display the cards in two columns, instead of a single one. 
- Experiment with an alternative: if the screen is wide enough (more than, say, 900), the Deck editor component should show the cards in a grid, rather than a column. To do this, look up the documentation of the [flexbox layout](https://reactnative.dev/docs/flexbox). Otherwise, the deck editor stays in a column.

To experiment with the width of the application, remember that you can "pop out" the window and resize it.

In addition, you can practice improving the scrolling of the cards in the deck editor by using ScrollViews and FlatLists. If you have time, add a "review mode" to the Deck component (not the editor). When pressing a button, the Deck component shows a SectionList of the cards, organized in three sections: those that have been guessed right, guessed wrong, and those that are unseen.
