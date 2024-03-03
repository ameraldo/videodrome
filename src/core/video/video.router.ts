import { Router } from 'express'

import * as videoController from './video.controller'

import handle from '../../middleware/asyncHandler'

const router = Router()

router.get('/', handle(videoController.renderVideo))
router.get('/stream', handle(videoController.stream))

export default router
