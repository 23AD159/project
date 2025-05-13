const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getMyAppointments
} = require('../controllers/appointmentController');

router.route('/')
    .post(protect, createAppointment)
    .get(protect, getAppointments);

router.route('/myappointments').get(protect, getMyAppointments);

router.route('/:id')
    .get(protect, getAppointmentById)
    .put(protect, updateAppointment)
    .delete(protect, deleteAppointment);

module.exports = router;
