const express = require('express');
const app = express();
const routes = require('./routes');
require('dotenv').config();

const PORT = process.env.PORT || 3030;

app.use('/api', routes);

app.get('/', (_, res) => {
  res.redirect('/api');
});

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
