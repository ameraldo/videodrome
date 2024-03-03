import express, { type Request, type Response, type NextFunction } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import config from 'config'

import router from './router'
import logger from './logger'

import { type Config, type CustomError } from './types/declarations'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../', 'public')))

// TODO: fix the disabled eslint error below
// eslint-disable-next-line @typescript-eslint/unbound-method
app.use(morgan('short', { stream: logger.stream as any }))

// Routes
app.use('/', router)

// Config the View Engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))

// Error handler
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next()
  } else {
    logger.error(err.message)
    // logger.error(err.stack)
    const status = err.status ?? 500
    res
      .status(status)
      .send({ name: err.name, reason: err.reason, status, message: err.message })
  }
})

// Start the server
const port: Config['port'] = config.get('port')
app.listen(port, () => {
  logger.info(`Api is running on port: ${port}`)
})
