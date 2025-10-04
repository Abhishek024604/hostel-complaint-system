const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const controller = require('../controllers/complaintController');

router.post('/', auth, permit('student'), controller.createComplaint);
router.get('/me', auth, controller.getMyComplaints);
router.get('/all', auth, permit('clerk','warden'), controller.getAll);
router.patch('/:id', auth, permit('clerk','warden'), controller.updateStatus);
router.get('/stats', auth, permit('clerk','warden'), controller.stats);

module.exports = router;
