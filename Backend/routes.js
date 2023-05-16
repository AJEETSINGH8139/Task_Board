const express = require('express');
const router = express.Router();
const User = require('./models/User');
const List = require('./models/List');
const Task = require('./models/Task');

// Define routes here

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    User.findOne({ where: { username, password } })
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
        res.status(404).json({ message: 'User not found' });
        }
        })
    .catch((error) => {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
});
    
// Get all lists
router.get('/lists', (req, res) => {
List.findAll({ include: Task })
.then((lists) => {
res.status(200).json(lists);
})
.catch((error) => {
console.error('Error fetching lists:', error);
res.status(500).json({ message: 'Internal server error' });
});
});

// Create a new list
router.post('/lists', (req, res) => {
const { name } = req.body;

List.create({ name })
.then((list) => {
res.status(201).json(list);
})
.catch((error) => {
console.error('Error creating list:', error);
res.status(500).json({ message: 'Internal server error' });
});
});

// Update a list
router.put('/lists/:id', (req, res) => {
const { id } = req.params;
const { name, tasks } = req.body;

List.update({ name }, { where: { id } })
.then(() => {
return Task.destroy({ where: { ListId: id } });
})
.then(() => {
const taskPromises = tasks.map((task) => Task.create({ name: task.name, completed: task.completed }));
return Promise.all(taskPromises);
})
.then((createdTasks) => {
return List.findByPk(id)
.then((list) => {
return list.addTasks(createdTasks);
});
})
.then(() => {
res.sendStatus(204);
})
.catch((error) => {
console.error('Error updating list:', error);
res.status(500).json({ message: 'Internal server error' });
});
});

// Update a task
router.put('/lists/:listId/tasks/:taskId', (req, res) => {
const { listId, taskId } = req.params;
const { completed } = req.body;

Task.update({ completed }, { where: { id: taskId, ListId: listId } })
.then(() => {
res.sendStatus(204);
})
.catch((error) => {
console.error('Error updating task:', error);
res.status(500).json({ message: 'Internal server error' });
});
});

module.exports = router;
