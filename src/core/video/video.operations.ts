import fs from 'fs/promises'
import { type Stats, constants } from 'fs'

export async function checkFile (filePath: string): Promise<{ valid: boolean, mimeType: string }> {
  await fs.access(filePath, constants.R_OK)
  const splitPath = filePath.split('/')
  const fileName = splitPath[splitPath.length - 1]
  const splitFile = fileName.split('.')
  const mimeType = splitFile[splitFile.length - 1]
  return { valid: true, mimeType }
}

export async function getStats (filePath: string): Promise<Stats> {
  return await fs.stat(filePath)
}
