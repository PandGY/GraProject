import { Router } from 'express'
const router = Router()
import authenticate from '../middlewares/auth.js'
import ContractController from '../controllers/contract.js'
import multer from 'multer'
const upload = multer()

router.post('/upload', authenticate, upload.single('file'), ContractController.uploadContract)
router.get('/verify/:cid', authenticate, ContractController.verifyContract)

export default router