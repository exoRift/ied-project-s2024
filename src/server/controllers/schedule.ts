import type { Middleware } from 'polka'
import { CronJob } from 'cron'
import { releaseAmount as releaseWater } from '../../lib/pump'
import { releaseAmount as releaseNutrients } from '../../lib/nutrients'
import { mixerOn } from '../../lib/mixer'
import { irrigate } from '../../lib/irrigator'

const MIX_TIME = 30e3

let setting: Schedule
let job: CronJob | undefined

export interface Schedule {
  cron: string
  waterAmount: number
  nutrientAmount: number
}

export const setSchedule: Middleware<any, any, Schedule> = (req, res) => {
  job?.stop()

  const {
    cron,
    waterAmount,
    nutrientAmount
  } = req.body

  setting = req.body
  job = CronJob.from({
    cronTime: cron,
    onTick: () => {
      // Once done, turn on mixer and then release
      function* postRelease (): Generator<void> {
        yield
        mixerOn(MIX_TIME, () => irrigate(waterAmount + nutrientAmount))
      }

      releaseWater(waterAmount, postRelease)
      releaseNutrients(nutrientAmount, postRelease)
    },
    start: true,
    timeZone: 'America/New_York'
  })

  res.tsend(200)
}

export const getSchedule: Middleware = (req, res) => {
  if (setting) res.tsend(200, setting)
  else res.tsend(404)
}
