require('dotenv').config();
const express = require('express');
const app = express();
const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const tasksRoutes = require('./routes/tasks');
const commentsRoutes = require('./routes/comments');


app.use(express.json());


app.use('/users', usersRoutes);
app.use('/projects', projectsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/tasks', commentsRoutes); 


app.listen(3000);
