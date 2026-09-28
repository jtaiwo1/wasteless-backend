const { Router } = require('express')
const { scanReceipt } = require('../controllers/receiptScanner')
const authenticator = require('..//middleware/authenticate')

const scanReceiptRouter = Router()

scanReceiptRouter.post("/", authenticator, scanReceipt)

module.exports = scanReceiptRouter