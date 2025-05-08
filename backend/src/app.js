const { env } = require('./config');
const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});
