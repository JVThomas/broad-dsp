const _ = require('lodash');
const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');

let app = express();

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
app.use(morgan('dev'));
app.use(routes);

app.listen(8080);
console.log('App now running on port 8080');

module.exports = app;