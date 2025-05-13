const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    createMedicineReview
} = require('../controllers/medicineController');

router.route('/')
    .get(getMedicines)
    .post(protect, admin, createMedicine);

router.route('/:id/reviews').post(protect, createMedicineReview);

router.route('/:id')
    .get(getMedicineById)
    .put(protect, admin, updateMedicine)
    .delete(protect, admin, deleteMedicine);

module.exports = router;
