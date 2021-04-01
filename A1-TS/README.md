# Assignment 1

The goal of this assignment is to practice the principles of functional programming with TypeScript. You will use the `users` data structure that we used in the first two react native classes. It contains 50 users in the file `users.ts`, which also contains type definitions for the data structure. Using this file, you should implement the following functions inside `assignment.ts`:

- A function that determines if a password is weak. A password is weak if it has only lowercase letters and is less than 8 characters long. 
- A function that determines if a password is strong. A password is strong if it is at least 30 characters long, or if it is at least 15 characters and does not contain only lowercase letters, or if it is more than 10 characters and contains 3 types of characters (lowercase, uppercase, digits, or special characters).
- A function that returns the name of all the users that have a weak password.
- A function that returns an object with three counts: the number of users that have a weak password, the number of users that have a strong password, the number of users that have a password of medium difficulty.
- A function that resets all weak passwords: all users with a weak password have their password changed to "pleaseupdateyourpassword" (in practice, this is probably a terrible idea!).
- A function that sorts the users by their age.
- A function that counts all the nationalities present in the data.
- A function that returns the users that do NOT have an email at the `example.com` domain.
- A function that returns the most common domain name for emails that is not `example.com`.
- A function that returns the locations of the users that are German.
- A function that returns the users who have a postcode that is not a number.
- A function that returns the names and emails of the users who have an email address that do not contain there first or last name.
- A function that returns the names of the users who do not have a valid ID.

All functions must be properly typed with TypeScript annotations, at least for their arguments and return types.


**Note**: This assignment is about TypeScript only, not React. You do not need to render components. It is enough to define functions, and call them, like so:

```typescript

const weakPassword = (password: string): boolean => {
    // you should fill this
}

// to test it, just call it

weakPassword("weak") // should return true
weakPassword("superStrong2#454rrffdg43") // should return false

```

