const express = require('express');
const verifyAuthentication = require('./filters/verifyAuthentication');
const users = require('./controllers/users');
const products = require('./controllers/products');

const routes = express();

// Usuários
routes.post('/usuarios', users.enroll);
routes.post('/login', users.login);

routes.use(verifyAuthentication);

// Usuários
routes.get('/perfil', users.getProfile);
routes.put('/perfil', users.editProfile);

// Produtos
routes.get('/produtos', products.list);
routes.get('/produtos/:id', products.get);
routes.post('/produtos', products.add);
routes.put('/produtos/:id', products.edit);
routes.delete('/produtos/:id', products.remove);

module.exports = routes;