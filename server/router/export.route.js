const express = require('express');
const { createExportBillController, getExportBillController, getExportBillByIdController, deleteExportBillController } = require('../controllers/exportBill.controller');
const router = express.Router();

router.post('/export', createExportBillController);
router.get('/export', getExportBillController)
router.get('/export/:id', getExportBillByIdController);
router.delete('/export/:id', deleteExportBillController);

module.exports = router;