import { Router } from 'express'

import * as browserController from './browser.controller'

import handle from '../../middleware/asyncHandler'

const router = Router()

router.get('/', handle(browserController.renderBrowser))

export default router
