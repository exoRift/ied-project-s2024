import type { Middleware } from 'polka'
import { CronJob } from 'cron'
import { releaseAmount as releaseWater } from '../../lib/waterpump'
import { releaseAmount as releaseNutrients } from '../../lib/nutrientpump'
import { mixerOn } from '../../lib/mixermotor'
import { irrigate } from '../../lib/irrigationpump'

const MIX_TIME = 30e3

let setting: Schedule
let job: CronJob | undefined

export interface Schedule {
  cron: string
  waterAmount: number
  nutrientAmount: number
}

/**
 * Schedule water/nutrient release
 */
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

/**
 * Get the active schedule
 */
export const getSchedule: Middleware = (req, res) => {
  if (setting) res.tsend(200, setting)
  else res.tsend(404)
}
