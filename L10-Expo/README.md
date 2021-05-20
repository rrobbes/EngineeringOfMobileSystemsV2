# Lab 10: Expo API 

For this lab, we will start with the [User List with QR Code Scanning and sharing](https://snack.expo.io/@rrobbes/user-list-with-qr-code-sharing). The goal of this lab is to extend it with additional features using the Expo API. You can consult the lectures on the expo API:
- [Expo API and Persistence](https://github.com/rrobbes/EngineeringOfMobileSystemsV2/tree/main/16-Expo-1)
- [Expo Device Sensors](https://github.com/rrobbes/EngineeringOfMobileSystemsV2/tree/main/17-Expo-2)

In particular, you should work on the following tasks, while consulting the expo API:

- Each user has a location, which is a latitude and longitude. When showing the details of the user, display a Map showing where the user is located.
- The randomly generated users have randomly generated addresses. While the cities they are in exist, the streets generally do not match (and often do not exist). Use the geocoding API to find out the address that match their actual location. When seing the details of the user, provide a button to "fix" their address. (as a bonus, you can do the opposite: add a text field toedit the address of a user, and then set their location to that address).
- Make the user cache persistent and the list of scanned users persistent, using the async storage API.
- When a user is in the cache or is in the scanned list (the "persistent" users), render them differently in the user list (with a light gray background).
- Add an additional Map View, where all the saved users are displayed at once. To differentiate them, the markers of the map should have the photo of the users.
- Add a way to share all the persistent users at once, in a single QR code, and to scan it in another device.