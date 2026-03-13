const express = require('express');
const proposalRoutes = require('./proposalRoutes');
const impactRoutes = require('./impactRoutes');
const dashboardController = require('../controllers/dashboardController');
const proposalListController = require('../controllers/proposalListController');
const impactListController = require('../controllers/impactListController');
const logRequests = require('../middleware/logRequests');

const router = express.Router();

router.use(express.json());
router.use(logRequests);

router.get('/dashboard/stats', dashboardController.getStats);
router.get('/proposals', proposalListController.list);
router.get('/impact-reports', impactListController.list);
router.get('/impact-reports/:id', impactListController.getById);
router.use('/proposal', proposalRoutes);
router.use('/impact', impactRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
