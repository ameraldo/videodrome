import { type Request, type Response, type NextFunction } from 'express'

type Handler = (req: Request, res: Response, next?: NextFunction) => Promise<NextFunction> | Promise<Response> | Promise<void>

export default (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
  try {
    handler(req, res, next)
      .then(() => { next() })
      .catch((error) => { next(error) })
  } catch (error) { next(error) }
}
