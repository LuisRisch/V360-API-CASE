const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const listRoutes = require('./routes/list');
const taskRoutes = require('./routes/task');

/* application/json */
app.use(bodyParser.json());

/* General route */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use(listRoutes);
app.use(taskRoutes);

/* Error handling route */
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://LuisFelipeRisch:Luis25111999@cluster0.n9zin.mongodb.net/todo?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));

