# Assignment 1, 2022/2023: Yahtzee

Yahtzee is a simple dice game, that requires both luck and a little bit of strategy. Briefly, players take turns in which:

- a player throws 5 dice
- they choose any number of dice to keep, and throw the rest
- they choose any number of dice to keep, and throw the rest (again)
- they pick one of thirteen categories of combinations, which determines their score 

Another player takes their turn, and the process repeats thirteen times, until all players have filled all the combinations. The scores are then summed and the player with the most points wins.

The detailed rules, along with the combinations and the way their score is calculated, can be found here:
https://en.wikipedia.org/wiki/Yahtzee

## Goal of the assignment

The goal of the assignment is to make a computer-based version of Yahtzee, **in TypeScript, using the principles of Functional Programming**. Think carefully about the design of your game, the data structures used, and the type annotations that you will use.
**Programming style will be evaluated, not only functionality**. The assignment is not mandatory, but doing it well can give you a bonus to your final grade.

The starter code for the assignment is available on replit, at this link: https://replit.com/@RomainRobbes/YahtzeeStarter#index.ts 
This contains the necessary libraries to get started (in particular, how to read user input from the console in a synchronous way, as we have not yet seen how to do async programming).

The assignment is due on **Friday, October 28**. There is an assignment on Teams where you can provide a link to your solution. **The solution should be a link to replit**: I don't want to spend a lot of time setting up individual solutions for many students.

## Yahtzee on a computer

The game will be text-based and played in the console. When the game starts, it should ask for the number of players that will play (one to, let's say, four--it could be any arbitrary number).

Each player will be assigned a color, to identify them easily. Some of the text (not all) printed during a turn should match the player's color so that it's clear who is playing.
At each turn, the program will:

- display the player's current list of combinations and their score, so that they remember what they have left to do. You can use the score sheet below for inspiration
- throw five dice and show the result to the player
- the player then inputs the dice that they want to keep (any number, from none to all)
- the program then re-throws the dice that are not kept, and show the results to the player
- the player then inputs the dice that they want to keep (any number, from none to all)
- the program then re-throws the dice that are not kept, and show the results to the player
- the player then inputs the combinations he wants to fill in with his result
- the player's score is updated, and the score sheet is displayed again

A possible score sheet would look like this:


![score sheet example](Score%20sheet.png)

The program then switches to the next player, until all players have played 13 turns. At this point, the final scores are computed, and the winner is determined, and congratulated.

## Style example

An example of the style I expect is the tic-tac-toe game: 
https://replit.com/@RomainRobbes/TicTacToe

Note that the example does not use any for loops, etc. This might be too strict (but a good learning opportunity!). It is fine to use for loops, as long as they are used in a controlled way (see the functional programming class and lab). 
