'use strict';

const app = require('@app');
const config = require('./config.js');

app.emit('loads', { config });
