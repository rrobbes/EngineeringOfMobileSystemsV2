# The Expo API: device Sensors

We have previously seen [quite a lot of the expo API](https://github.com/rrobbes/EngineeringOfMobileSystemsV2/tree/main/16-Expo-1). This second part focuses on a smaller part of the API, which revolves around device sensors. A mobile device has many sensors that can be used for a variety of purposes. This starts with the camera, which, due to its ease of movement, has many more uses in a mobile device than in a laptop or desktop computer. In addition, mobile devices have many more sensors, including sensors for device orientation in space, elevation, speed, and position on earth.  

Since we are talking about a smaller number of APIs and APIs that revolve around sensors, we will have more practical examples than the previous class, which was mainly about giving starting points on the Expo API.

The reminders from last class apply: effects with `useEffect` may be needed, which have to be managed carefully; in particular, subscriptions should be unsubscribed as "effect cleanup" (sensors use subscriptions); and you should always be mindful of the device resources (battery, network, etc). 

## Cameras and QR Codes

The device camera can be accessed, to do a variety of things: taking pictures, doing video and audio recordings, etc. Moreover, cloud APIs can be used to leverage computer vision algorithms, to do things such as face detection in a picture. 
- [Camera](https://docs.expo.io/versions/latest/sdk/camera/) 
- [Face Detection](https://docs.expo.io/versions/latest/sdk/facedetector/) (may require payment)

A specific use case of the camera is to use it to transmit data, by using it as bar code or qrcode scanner. The QR code scanner can be used to transmit string-based data (with a maximum length of 4000 characters, which is actually quite a lot) reliably. It is then possible to transmit an actual object, provided that they are small enough, by:

- converting an object to a JSON string
- generating a QR code for this JSON string
- display the QR code
- scan the QR code with a device to get the JSON string
- parse the string as a JSON object

The API is simple to use, and does not require using effects, just providing a callback on a component that tells the component what to do when a barcode or a QR code is scanned. The callback expects a data structure which documents the type of code scanned (QR code, various formats of barcodes), and the data. In the case of QR codes, to increase the robustness of the application, you may want to add a "prefix" to the string embedded in the QR code, to distinguish your QR codes from arbitrary ones. 

- [QR Code Scanner](https://docs.expo.io/versions/latest/sdk/bar-code-scanner/) (not stricly necessary, as the camera can handle it too, but makes your intent clearer)
- [QR Code Generator](https://github.com/AwesomeJerry/react-native-qrcode-svg) (not the expo API, generates a QR code as an [SVG Image](https://docs.expo.io/versions/v35.0.0/sdk/svg/))

As an example of this, we can see how to implement QRCode-based data sharing in the Contact list example. The scenario is the following: a contact needs to be shared between two people; one person can show a QR code on one device; the second person can scan it, to download a JSON object representing the contact.


## Sensors
There is a variety of sensors that the device contains. Each of these sensors can be used to receive data via a subscription through a callback. Some of these sensors can receive updates regularly (specifying an interval---be mindful of the frequency of updates, as it may affect the battery), while others (e.g. the pedometer) will send updates only when new data comes in, as it may come in irregularly (you don't walk all the time). Remember to unsunscribe to the sensors when they are not needed. The accessible sensors are:

- [Sensors](https://docs.expo.io/versions/latest/sdk/sensors/): General entry points.
- [Barometer](https://docs.expo.io/versions/latest/sdk/barometer/): For air pressure, and relative elavation (the latter is iOS only).
- [Gyroscope](https://docs.expo.io/versions/latest/sdk/gyroscope/): for device orientation in space.
- [Accelerometer](https://docs.expo.io/versions/latest/sdk/accelerometer/): for accelaration (including gravity). Gravity helps to determine orientation too.
- [Magnetometer](https://docs.expo.io/versions/latest/sdk/magnetometer/): to measure the magnetic field, which can be used to determine the heading of the device on the earth (such as to provide orientation on a map). 
- [Pedometer](https://docs.expo.io/versions/latest/sdk/pedometer/): count the number of steps taken by the user (based on the previous sensors).
- [DeviceMotion](https://docs.expo.io/versions/latest/sdk/devicemotion/): integrate several of the previous sensors in an easier to read output (such as removing the gravity component from the accelerometer output, if not needed). Also provides higher-level information such as device orientation (portrait, landscape, upside down). Also provides heading (which can be computed manually from sensor data)
- [Orientation](https://docs.expo.io/versions/latest/sdk/screen-orientation/): Used to detect the device orientation and adjust the UI accordingly, such as switching from portrait to landscape mode.

Examples of sensor usages can be found in [this application](https://snack.expo.io/@rrobbes/saymysteps), which access the sensors to showcase a variety of usages (not necessarily useful ones!). It also shows that one can define **custom hooks** to use sensors more easily.

A second example is more useful, as it may help you not suffer from neck pain in the future. 

## Location

A third useful set of sensors is location services, that can be used to determine the device's location on the earth, as a latitude and longitude. This can be very useful in a map, for instance. The entry point is the [Location API](https://docs.expo.io/versions/latest/sdk/location/). This requires important permissions to be granted by the user, as the location is sensitive information. The location can be queried at a given point in time, or callbacks can called when it changes instead. It is even possible to set up **geofencing**, which means that you can set up specific regions of interest, and you will receive a callback when you are inside such a region. For instance, you can receive a callback when you are "at home", if you have set up a geofence around your home.

The API also supports heading (so you don't necessarily need to compute it from the magnetometer), and also geocoding (converting an address to latitute and longitude), as well as reverse geocoding (converting a latitude and longitude to an address). Both geocoding and reverse geocoding services require access to web services.

A final note here is that access to location and geocoding are **very taxing operations**: they require acessing the GPS, cellular networks, etc, so they can have a significant impact on the battery. So they shoud be used wisely (you can set up the level of precision that you need), and sparingly (as rarely as you can get away with).
