const mongoose = require('mongoose');

const exportSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    items: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        total: { type: Number, default: 0 }
    }],
    totalAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

exportSchema.pre('save', function (next) {
    this.items.forEach(item => {
        item.total = item.price * item.quantity;
    });
    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
    next();
});

const ExportBill = mongoose.model('Export', exportSchema);
module.exports = ExportBill;