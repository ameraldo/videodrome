import fs from 'fs/promises'
import path from 'path'

import { type Stats } from 'fs'

export async function readDirectory (directoryPath: string): Promise<Array<{ stats: Stats, name: string }>> {
  const directoryContent = await fs.readdir(directoryPath)
  return await Promise.all(directoryContent.map(async (name: string) => {
    const stats = await fs.stat(path.join(directoryPath, name))
    return { stats, name }
  }))
}

export function getPreviousPath (currentPath: string): string {
  const splitPath = currentPath.split('/')
  splitPath.pop()
  return splitPath.join('/')
}

export function checkFile (fileName: string): { isSupported: boolean, mimeType: string } {
  const supportedMimeTypes = ['mp4', 'ogg', 'ogv', 'webm']
  const splitFileName = fileName.split('.')
  const mimeType = splitFileName[splitFileName.length - 1]
  return { isSupported: supportedMimeTypes.includes(mimeType), mimeType }
}
