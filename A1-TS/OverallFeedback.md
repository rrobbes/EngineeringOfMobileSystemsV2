# Overall feedback for assignment 1

## Grading scheme

I adopted the following grading scheme:

- **3:** An assignment that mostly follows the principles seen in class. This is not necessarily a “perfect” solution, see the detailed feedback for potential ways to improve it.
- **2:** An assignment that follows some of the principles seen in class, but not all. 
- **1:** An assignment that generally does not follow the principles that were seen in class. Detailed feedback is given in individual solutions.

## Common issues

### Grade 1

For grade 1, some issues include:

- Not passing the user array as an argument to functions, but treating as a global variable
- Very limited uses of typescript
- Many functions that directly mutate the input arguments, instead of returning a transformed version of the input. Sometimes, a symptom of this is a function that returns “Void”, instead of a result.
- Computations done in expressions stored in global variables, rather than done inside functions. These computations can not be reused in other contexts

### Grade 2

For grade 2, a common way to improve these assignments would be to replace for, while, and forEach-type loops with methods from Arrays that use higher-order functions, in order to increase the legibility of the code. For instance, going from:

```typescript

const usersWithWeakPasswords = (users: User[]): Name[] => {
    let names: Name[] = []
    for (let i:number = 0; i < users.length; i++) {

        if (weakPassword(users[i].login.password)) {
            names.push(users[i].name);
        }
    }
    return names;
}
```

To:
 
 ```typescript
 
const usersWithWeakPasswords = (users: User[]): Name[] => {
    return users.filter(user => weakPassword(user.login.password))
                .map(user => user.name)
}
```


### Grade 3

Finally, there were two common issues shared by most solutions, including at grade 3, in questions 5 and 6.

- For question 5, most of you interpreted resetting weak passwords as directly mutating the data structure passed as argument to the function. Instead, the correct way to do it was to return a *new* list of users, with those users having a weak password being reset in this new list. Some “almost correct” solutions did not mutate the input list, but only returned the users with the reset password, overlooking that the users that had a strong enough password should also be included in the list.
- For question 6, this is perhaps not obvious (as you can only know this from the documentation), but if you use Array.sort(), this method mutates the array directly, which does not comply with the principles seen in class. If you want to use it, you should first make a copy of the array, and then sort this copy.
