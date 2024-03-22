import type { Middleware } from 'polka'
import { CronJob } from 'cron'

let job: CronJob | undefined

export const setSchedule: Middleware = (req, res) => {
  job?.stop()

  job = CronJob.from({
    cronTime: req.body,
    onTick: () => console.log('tick'),
    start: true,
    timeZone: 'America/New_York'
  })
}
