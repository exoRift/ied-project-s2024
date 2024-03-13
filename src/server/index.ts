import polka from 'polka'
import serve from 'sirv'
import { json } from 'body-parser'
import cors from 'cors'

const {
  PORT,
  NODE_ENV
} = process.env

const app = polka()

app
  .use(cors())
  .use(json())

app.all('/api', (req, res) => res.send(200))

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
