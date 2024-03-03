import os from 'os'
import path from 'path'
import { type Request, type Response } from 'express'

import { checkFile, getPreviousPath, readDirectory } from './browser.operations'

const rootDirectory = os.homedir()

export async function renderBrowser (req: Request, res: Response): Promise<void> {
  const currentPath = req.query.path as string ?? ''
  const previousPath = getPreviousPath(currentPath)

  const directoryDetails = await readDirectory(path.join(rootDirectory, currentPath))
  const dir = directoryDetails.map((element) => {
    if (element.stats.isDirectory()) return { name: element.name, type: 'dir' }
    if (element.stats.isFile() && checkFile(element.name).isSupported) return { name: element.name, type: 'file' }
    return { name: element.name, type: 'unsupported' }
  })

  res.render('browser', { dir, path: { currentPath, previousPath } })
}
