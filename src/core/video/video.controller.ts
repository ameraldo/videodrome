import path from 'path'
import os from 'os'
import fs from 'fs'
import { type Request, type Response } from 'express'

import { checkFile, getStats } from './video.operations'

const rootDirectory = os.homedir()

export async function renderVideo (req: Request, res: Response): Promise<void> {
  const filePath = req.query.path as string ?? ''
  try {
    await checkFile(path.join(rootDirectory, filePath))
    res.render('video', { path: filePath })
  } catch (error) { res.render('video', { error: true }) }
}

export async function stream (req: Request, res: Response): Promise<Response> {
  const filePath = req.query.path as string ?? ''
  const { mimeType } = await checkFile(path.join(rootDirectory, filePath))
  const stats = await getStats(path.join(rootDirectory, filePath))

  const { range } = req.headers
  if (range !== undefined) {
    const positions = range.replace(/bytes=/, '').split('-')
    const start = parseInt(positions[0], 10)
    const end = (positions[1].length > 0) ? parseInt(positions[1], 10) : stats.size - 1
    const chunkSize = (end - start) + 1
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stats.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': `video/${mimeType}`
    })
    return fs.createReadStream(path.join(rootDirectory, filePath), { start, end }).pipe(res)
  }

  res.writeHead(200, {
    'Content-Length': stats.size,
    'Content-Type': `video/${mimeType}`
  })
  return fs.createReadStream(path.join(rootDirectory, filePath)).pipe(res)
}
