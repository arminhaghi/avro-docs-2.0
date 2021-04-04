# Avro Docs React

Avro Docs React is a web app to display for Avro schema documentation.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and it was inspired by https://github.com/ept/avrodoc.

Checkout it out live on [Github pages](https://arminhaghi.github.io/avro-docs-react/#/)

### How to use
You need [node.js](http://nodejs.org/) installed. I've tested this with Node 12.

Clone the repo

    $ gitclone git@github.com:arminhaghi/avro-docs-react.git

Copy your avsc files to `./public/avro/`

    $ npm install
    $ npm run build

Deploy content of the `build` folder to your web server.


Notes:
* Since this project was bootstrapped using *Create React App* it requires a web server to serve the content. It's also uses clinet side routing using [React Router](https://reactrouter.com/).
[Here](https://create-react-app.dev/docs/deployment/) is more information of how you can deploy this app.
* The application expect the folder structure of the avro files to match the filenamespace, otherwise it won't find the schema to load. In the [live](https://arminhaghi.github.io/avro-docs-react/#/) example, the content of the `./public/avro` folder is the following:
```
.\public\avro\com\example\internal\User.avsc
.\public\avro\com\example\Person.avsc
```

### Features

* React
* Excellent for getting an overview of a complex schema with many nested records
* Renders documentations as [Markdown](http://daringfireball.net/projects/markdown/syntax).

### Todo

* Add Unit Test

### Contribution

This is a work in progress. Pull requests are welcome.
