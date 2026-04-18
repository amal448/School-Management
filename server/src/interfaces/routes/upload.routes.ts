import { Router, Request, Response } from 'express'
import multer                         from 'multer'
import path                           from 'path'
import fs                             from 'fs'
import { createAuthMiddleware }       from 'src/interfaces/middlewares/auth.middleware'
import { Role }                       from 'src/domain/enums'
import { HttpStatus }                 from 'src/shared/enums/http-status.enum'

type AuthMW = ReturnType<typeof createAuthMiddleware>

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits:    { fileSize: 5 * 1024 * 1024 },   // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only JPEG, PNG, WEBP images allowed'))
  },
})

export const createUploadRouter = (authMW: AuthMW): Router => {
  const router = Router()
  const { authenticate, authorize } = authMW
  const adminManager = [
    authenticate,
    authorize(Role.ADMIN, Role.MANAGER),
  ]

  // POST /api/upload/image
  router.post(
    '/image',
    adminManager,
    upload.single('image'),
    (req: Request, res: Response) => {
      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No file uploaded',
        })
        return
      }

      const url = `${process.env.BACKEND_URL ?? 'http://localhost:5000'}/uploads/${req.file.filename}`
      res.status(HttpStatus.CREATED).json({
        success: true,
        data:    { url },
      })
    },
  )

  return router
}