# Energy

A dashboard displaying data about production and consumption of electric energy.
Coded with **React.js** + **TypeScript**, with **Vite.js** as bundler.
Charts made with [Echarts](https://echarts.apache.org/).

### Installation & How to run

With Node and npm installed:
- Run ```npm install``` to install dependencies
- Run ```cp .env.example .env``` to create a local .env file
- Add the URL variable in .env
- Run ```npm run dev``` to start the developer server.

You will see an error, because we are trying to fetch from localhost an endpoint that doesn't allow cross-domain requests.
As a workaround for this issue, I installed a [Chrome extension](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf) that adds a ```Access-Control-Allow-Origin: *``` rule to the request header, thus allowing cross-domain requests.

### Folders & files

