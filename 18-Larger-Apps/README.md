# Building Larger Applications

In general building a larger application follows regular software engineering principles, although sometimes they are more specific to the context of mobile applications, including React Native's particularities.

## General SE Principles
General Software Engineering principles should be followed. These include:
- **Cohesion and coupling:** each module in the system should have a high cohesion (components of the module are coherent with each other), and a low coupling with other modules (they interact as little as possible with other modules). 
- **Information hiding:** design decisions, including important ones, should be known to as few modules as possible. This makes it much easier to change them at a later time. If you want to read more about this, the [original paper](https://apps.dtic.mil/sti/pdfs/AD0773837.pdf) is available. A support mechanism to information hiding is to provide modules with small interfaces, which provide limited and well specified means to interact with the modules.
- **Separation of concerns:** Applying information hiding and cohesion and coupling should lead to a code base where each concern is separated to the others, as much as possible.
- **Reuse:** if possible, modules should be reused in a variety of contexts, rather than re-implementing slightly different variants of the same modules. Note that this is much easier when modules are cohesive, and have sufficiently low coupling with other modules (so that they can interact with different modules). Information hiding is key to achieve such a low coupling. Smaller components are much easier to reuse!

## General mobile app considerations:

**Client/server architecture:** an architecture that is often effective for mobile applications is the client/server architecture. The mobile app would be the client, where users will interact with the application, while the most complex logic could be implemented in a server. This makes the logic as reusable and platform-independent as possible, while the parts of the application that are more tailored to the user (e.g. the UI) are run on the mobile device. Such an application could also feature a different UI on the web, and/or provide several mobile applications for different use cases or user roles (e.g. an app for users, another for administrators of the app, etc). Such an organization would provice strong separation of concerns: if all communications goes through a server, the server can hide design decisions, such as how it communicates to other components (e.g., communication protocols of IoT devices). Likewise, the fact that there could be several types of UI is not necessarily known to the server. In addition, a server is a useful point of centralization, where different users may be able to share data and communicate.

**Reuse existing services:** it is important to know what to focus development effort on, and what not. Many specific services may not necessarily need to be implemented if a suitable solution exists. For instance, delegating user authentication to one or more specific services can be a good use of resources in order to avoid implementing the complex logic and security concerns associated with such services.

**Be mindful of limited resources**: As discussed previously, mobile devices have finite resources (battery, network, etc) that should be carefully managed. Failing to do so could very well lead to users un-installing your app. Thus your app should limit its resource usage and adapt to its context (possibly delaying work to a later time if resources are low). For instance, caching often requested information on device instead of consistently querying a server will save both battery and network resources. On the other hand, truly intensive computations might be run a server, rather than on the device itself, as a better tradeoff. 

**Working in the background**. Managing background activity is crucial to both manage communication with a server, and to manage long-running (or delayed tasks) on the device. 

## Considerations more specific to React Native:

**Information hiding in Javascript**: Modules can effectively hide information by carefully selecting what is visible (what the module exports). Thus they should just export what belongs to the interface of a module, rather than everything. Moreover, **Callbacks** are extensively used in Javascript to reduce coupling and thus increase information hiding: rather than implementing specific behaviour in a module, the modules that use it can pass this specific behaviour as a callback function that specify it. Of course, each module should be cohesive.

**Information hiding in React Native**: As mentioned earlier in the class, several critical design decisions, such as how navigation and state management are implemented, should be hidden from most React Components. In particular, a select few components (Screen components) should be in charge of handling navigation, and they may also be in charge of state management as well, given that their reusability is already limited. This would allow to make applications that better adapt to various layout much easier, by re-implementing screen components for a tablet, for instance, while re-using other components. 

**Separate UI from Core logic**: even in a monolithic application, the logic should not be mixed with the UI. Rather, a Core should be implemented, that does not feature a UI at all. Not that **custom hooks** can be used to separate UI from the logic too, if relevant to the use case.

**Handle data updates with React State or State Management**: Queries to servers should be separated from the core logic as well. Using state management (including react state), does however make it easier to update the application when new data comes in (with `useEffect` and `useState`).

**Make components as small as possible**: It is much better to split a component in several smaller components, to increase reuse opportunities. Likewise, extracting logic in custom hooks also helps with reusability. Finally, smaller data containers are also more reusable, and can lead to performance improvements.
