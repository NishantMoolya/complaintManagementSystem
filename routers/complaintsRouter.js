const express = require('express');
const { registerComplaint, getComplaints, resolveComplaint, revertComplaint, generateDailyLog, resolveParticularComplaint } = require('../controllers/complaintsController');

const complaintRouter = express.Router();

complaintRouter.get('/', getComplaints);
complaintRouter.post('/', registerComplaint);
complaintRouter.put('/resolve', resolveComplaint);
complaintRouter.put('/resolve/:id', resolveParticularComplaint);
complaintRouter.put('/revert/:id', revertComplaint);
complaintRouter.get('/logs', generateDailyLog);

module.exports = complaintRouter;