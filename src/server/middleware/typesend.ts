import send from '@polka/send-type'
import type { Middleware } from 'polka'

declare module 'express-serve-static-core' {
  interface Response {
    tsend: (status: number, content: any) => void
  }
}

const sendType: Middleware = (req, res, next) => {
  res.tsend = function (status: number, content: any) {
    send(this, status, content)
  }

  next()
}

export default sendType
