const Medicine = require('../models/Medicine');

const getMedicines = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const medicines = await Medicine.find({ ...keyword });
        res.json(medicines);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            res.json(medicine);
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Private/Admin
const createMedicine = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            manufacturer,
            countInStock,
            prescription_required
        } = req.body;

        const medicine = new Medicine({
            name,
            description,
            price,
            category,
            manufacturer,
            countInStock,
            prescription_required,
            user: req.user
        });

        const createdMedicine = await medicine.save();
        res.status(201).json(createdMedicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateMedicine = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            manufacturer,
            countInStock,
            prescription_required
        } = req.body;

        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            medicine.name = name || medicine.name;
            medicine.description = description || medicine.description;
            medicine.price = price || medicine.price;
            medicine.category = category || medicine.category;
            medicine.manufacturer = manufacturer || medicine.manufacturer;
            medicine.countInStock = countInStock || medicine.countInStock;
            medicine.prescription_required = prescription_required !== undefined ? prescription_required : medicine.prescription_required;

            const updatedMedicine = await medicine.save();
            res.json(updatedMedicine);
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            await medicine.remove();
            res.json({ message: 'Medicine removed' });
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/medicines/:id/reviews
// @access  Private
const createMedicineReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            const alreadyReviewed = medicine.reviews.find(
                (r) => r.user.toString() === req.user.toString()
            );

            if (alreadyReviewed) {
                res.status(400).json({ message: 'Medicine already reviewed' });
                return;
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user,
            };

            medicine.reviews.push(review);
            medicine.numReviews = medicine.reviews.length;
            medicine.rating =
                medicine.reviews.reduce((acc, item) => item.rating + acc, 0) /
                medicine.reviews.length;

            await medicine.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Medicine not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    createMedicineReview,
};
