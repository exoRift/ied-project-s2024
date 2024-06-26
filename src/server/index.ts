import polka from 'polka'

import serve from 'sirv'
import { json } from 'body-parser'
import cors from 'cors'
import { sendType } from './middleware/typesend'

import { getWaterLevel } from './controllers/waterlevel'
import { getSchedule, setSchedule } from './controllers/schedule'
import { getNutrientLevel, addNutrients } from './controllers/nutrientlevel'

const {
  PORT,
  NODE_ENV
} = process.env

const app = polka()

app
  .use(cors())
  .use(json())
  .use(sendType)

app.all('/api', (req, res) => res.tsend(200))
app.get('/api/level', getWaterLevel)
app.get('/api/schedule', getSchedule)
app.put('/api/schedule', setSchedule) /* eslint-disable-line @typescript-eslint/no-unsafe-argument */
app.get('/api/nutrients', getNutrientLevel)
app.post('/api/nutrients', addNutrients) /* eslint-disable-line @typescript-eslint/no-unsafe-argument */

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
