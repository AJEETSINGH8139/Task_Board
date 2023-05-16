const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Add middleware and routes here
const routes = require('./routes');

app.use(express.json());
app.use('/api', routes);


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});