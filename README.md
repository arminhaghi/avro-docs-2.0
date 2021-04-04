# Avro Docs React

Avro Docs React is a web app to display for Avro schema documentation.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and it was inspired by https://github.com/ept/avrodoc.

### How to use
You need [node.js](http://nodejs.org/) installed. I've tested this with Node 12.

Clone the repo

    $ gitclone git@github.com:arminhaghi/avro-docs-react.git

Copy your avsc files to `./public/avro/`

    $ npm install
    $ npm run build

Deploy content of the `build` folder to your web server.


Note: Since this project was bootstrapped using *Create React App* it requires a web server to serve the content.
[Here](https://create-react-app.dev/docs/deployment/) is more information of how you can deploy this app.

### Features

* React
* Excellent for getting an overview of a complex schema with many nested records
* Renders documentations as [Markdown](http://daringfireball.net/projects/markdown/syntax).

### Todo

* Add Unit Test

### Contribution

This is a work in progress. Pull requests are welcome.
