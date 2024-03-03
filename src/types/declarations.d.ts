// Declare custom types and interfaces

export interface Config {
  port: number
}

export interface CustomError extends Error {
  status?: number
  reason?: string
}

export type DynamicObject = Record<string, any>
