import polka from 'polka'

import serve from 'sirv'
import { json } from 'body-parser'
import cors from 'cors'
import { sendType } from './middleware/typesend'

import { level } from './controllers/level'

const {
  PORT,
  NODE_ENV
} = process.env

const app = polka()

app
  .use(cors())
  .use(json())
  .use(sendType)

app.all('/api', (req, res) => res.send(200))
app.get('/api/level', level)

if (NODE_ENV !== 'development') {
  app.use(serve('build', {
    single: true,
    ignores: '/api/*'
  }))

  console.info('Frontend mounted')
}

app.listen(PORT, () => {
  console.info('Server online listening at https://localhost:%s', PORT)
})
