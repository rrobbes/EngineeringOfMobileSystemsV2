# Lab 7: State and Navigation

The goal of this lab is to practice both [Navigation](../12-Navigation/README.md) and [State Management](../13/StateManagement/README.md). As a starting point, we will use the [flashcards with conditional rendering layout](https://snack.expo.io/@rrobbes/flashcards-conditional-layout). This version has:
- a component to select a deck of cards
- a component to view a deck of cards, marking cards as right or wrong (the "view mode").
- a component to edit a deck of cards, via adding cards, deleting cards, or editing them, as well as renaming a deck (the "edit mode").

This version is rendered via conditional rendering only. The tasks to do are the following, while trying to reuse as many existing components as possible:



# Tab-based navigation

Instead of a deck selector component, use a three tab interface in a brand new top component. The first tab corresponds to the "advanced french" card deck, the second one to "basic javascript", the third one to "genius-level math". For simplicity, it's ok if the screen component hard-codes which deck is selected. Still for simplicity, do not worry about the saving functionality and context at this point, nor screen width. Each screen shows one of the decks, in "view mode" only. No "back button" is necessary, since you can switch to a different deck by selecting another tab.

# Stack-based navigation

Implement a brand new top component that uses stack navigation. For simplicity, ignore for now how to save decks. The context should just be which deck is selected. There are several types of screens:
- a "Selection Screen", showing all the (currently three) decks available. Selecting one of the decks shows the "Review Screen", the next screen.
- the "Review Screen" has as title the name of the deck, and renders the deck in "view mode". The default back button goes back to the "selection screen". There is a button in the title bar to switch to "edit mode", which shows the "Edition Screen".
-  the "Edition Screen" has as title the name of the deck (prefixed by "Edit"), and renders the deck in "edit mode", which allows to rename the deck. The default back button goes back to the "review screen". There is a button in the title bar to swith to "card edit mode", which shows a last screen, the "Card Edit Screen".
- the "Card Edit Screen" has as title "Edit cards",  and can go back to the "Edition Screen". It shows all the cards in the decks, allowing to edit them, delete them, and add new cards.

# Full Context

For simplicity, we have been ignoring the context for now, which prevents properly saving the decks. You can now implement it, by:

- extracting parts of the state of the application and the callbacks into one (or more) **custom hooks**, independently of the rendering.
- add some of this state to the application context
- use this context in screen components, to pass it to "regular components" as props



