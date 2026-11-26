import type { ApiErrorBody } from '@bowlathon/shared'
import express, { type ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import { ZodError } from 'zod'

const errorBody = (code: ApiErrorBody['error']['code'], message: string): ApiErrorBody => ({
  error: { code, message },
})

const handleErrors: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res
      .status(400)
      .json(errorBody('VALIDATION_FAILED', err.issues[0]?.message ?? 'Invalid request'))
    return
  }
  // express.json() marks unparseable bodies this way.
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json(errorBody('VALIDATION_FAILED', 'Request body is not valid JSON'))
    return
  }
  console.error(err)
  res.status(500).json(errorBody('INTERNAL', 'Something went wrong'))
}

export function createApp() {
  const app = express()
  // Caddy, then the web container's nginx. Without it, rate limits see nginx's IP for every visitor.
  app.set('trust proxy', 2)
  app.use(helmet())
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api', (_req, res) => {
    res.status(404).json(errorBody('NOT_FOUND', 'No such endpoint'))
  })
  app.use(handleErrors)
  return app
}
