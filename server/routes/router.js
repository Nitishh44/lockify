const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const services = require('../services/render');
const controller = require('../controllers/controller');

// pages
router.get('/', auth, services.homeRoutes);
router.get('/add-entry', auth, services.add_entry);
router.get('/update-entry', auth, services.update_entry);
router.get('/add-password', services.add_entry);
router.get('/dashboard' , auth, services.homeRoutes);
router.get('/login', (req, res) => {
  res.render('login');
});
// API
router.post('/api/passwords', controller.create);
router.get('/api/passwords', controller.find);
router.get('/api/passwords/:id/show', controller.showPassword); // 👁 MUST BE HERE
router.put('/api/passwords/:id', controller.update);
router.delete('/api/passwords/:id', controller.delete);

module.exports = router;