import { Router } from 'express'

import home from './core/home/home.router'
import browser from './core/browser/browser.router'
import video from './core/video/video.router'

const router = Router()

router.use('/', home)
router.use('/browse', browser)
router.use('/video', video)

export default router
