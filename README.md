# Energy

A dashboard displaying data about production and consumption of electric energy.
Coded with **React.js** + **TypeScript**, with **Tailwind.css** and **Vite.js** as bundler.
Charts made with [Echarts](https://echarts.apache.org/).

### Installation & How to run

With Node and npm installed:
- Run ```npm install``` to install dependencies
- Run ```cp .env.example .env``` to create a local .env file
- Add the URL variable in the .env file
- Run ```npm run dev``` to start the developer server.

You will see an error, because we are trying to fetch from localhost an endpoint that doesn't allow cross-domain requests.
As a workaround for this issue, I installed a [Chrome extension](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf) that adds a ```Access-Control-Allow-Origin: *``` rule to the request header, thus allowing cross-domain requests.

### Folders & files

##### /config

TypeScript configuration files.



##### /public
Folder storing public assets.

#### /src

##### /components
- Button.tsx
- Chart.tsx
- DataGroup.tsx
- DisplayData.tsx
- ErrorMessage.tsx

##### /ts

- **api.ts**
Contains a function to fetch data from a fictive API. The endpoint that's currently requested exposes a static JSON file, that is filtered according to given dates.

- **formatters.ts**
Contains helper functions for formatting dates and energy values.

- **getters.ts**
Functions that transform, filter and format the data coming from the API according to different needs. 

- **reducers.ts**
Contains a reducer function that handles the update of the 'dates' reducer.

- **types.ts**
Exposes TypeScript types reused throughout the application.

##### App.tsx
The application main file, where the state is managed.
There are mainly 3 types of state:
- **content** (energyData): the energy data that are fetched from the API and displayed through Chart and DisplayData components.
- **dates**: represents the timespan chosen by the user for visualizing data. It is set by clicking on the Button components. Implemented with useReducer instead of useState, because the reducer is a better fit for implementing a 'switch' pattern.
- **application state** (loading and error): it is linked to the fetching process and handles API errors and edge cases.

##### index.css
Imports Tailwind classes for the whole application.

##### main.tsx
Launches the React application.


