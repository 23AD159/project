const Appointment = require('../models/Appointment');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
    try {
        const {
            doctor,
            appointmentDate,
            appointmentTime,
            reason,
            status = 'pending'
        } = req.body;

        const appointment = new Appointment({
            user: req.user,
            doctor,
            appointmentDate,
            appointmentTime,
            reason,
            status
        });

        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('user', 'id name')
            .populate('doctor', 'id name specialization');
        res.json(appointments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in user appointments
// @route   GET /api/appointments/myappointments
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user })
            .populate('doctor', 'id name specialization');
        res.json(appointments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('user', 'name email')
            .populate('doctor', 'name specialization');

        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            appointment.status = req.body.status || appointment.status;
            appointment.reason = req.body.reason || appointment.reason;
            appointment.appointmentDate = req.body.appointmentDate || appointment.appointmentDate;
            appointment.appointmentTime = req.body.appointmentTime || appointment.appointmentTime;

            const updatedAppointment = await appointment.save();
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            await appointment.remove();
            res.json({ message: 'Appointment removed' });
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getMyAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
};
