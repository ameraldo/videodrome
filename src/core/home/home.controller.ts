import { type Request, type Response } from 'express'

export async function renderHome (req: Request, res: Response): Promise<void> {
  res.render('home', { title: 'videodrome' })
}
