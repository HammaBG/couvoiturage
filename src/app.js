const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const versionate = require('feathers-versionate');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const authentication = require('./authentication');
const mongoose = require('./mongoose');
const jobs = require('./jobs');
const mailer = require('./mailer');
const swagger = require('feathers-swagger');
const memory = require('feathers-memory');
const swaggerConfig = require('./swagger-config');
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const multer = require('multer');
const fsystem = require('fs');

const app = express(feathers());
let uploadsPath = __dirname.substr(0, __dirname.length - 4) + '/public/uploads';
let blobStorage = fs(uploadsPath);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'public/uploads/5fe48cd995802b23d05242b4'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-.jpg`)
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `public/uploads/${req.params.id}`;
    fsystem.exists(dir, exist => {
      if (!exist) {
        return fsystem.mkdir(dir, error => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-.jpg`);
  }
});

const messageService = memory();

// Load app configuration
app.configure(configuration());
// Configure versionate
app.configure(versionate());
// Register a base-path "/api", and provide access to it via `app.api`
app.versionate('api', '/api/');

// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    frameguard: false
  })
);

app.use(cors());
app.use(compress());
app.use(express.json({ limit: '10000000mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

app.configure(swagger(swaggerConfig(app)));

// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);
// job queue
app.configure(jobs);
// mailer
app.configure(mailer);

// Configure middleware for unknown api paths
app.use('/api/', (req, res) => {
  res.status(404).json({ error: 'Invalid path' });
});

// SPA support, return index for unknown paths
app.use('/client/', (req, res) => {
  res.sendFile(path.join(app.get('public'), 'client', 'index.html'));
});

// SPA support for admin app, return index for unknown paths
app.use('/admin/', (req, res) => {
  res.sendFile(path.join(app.get('public'), 'admin', 'index.html'));
});

app.use((req, res) => {
  res.redirect(301, '/admin/');
});

// Configure the error handler
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
