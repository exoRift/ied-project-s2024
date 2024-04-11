import { Gpio } from 'onoff'

import pins from './pins.json' assert { type: 'json' }

// The time it takes for sound to travel at STP
const MS_PER_CM = 10 / 343 /* speed [m/s] ^-1 * 1000 / 100 */

// Container area (dm^2)
const FIRST_STAGE_ML_PER_CM = 157.3
const SECOND_STAGE_ML_PER_CM = 146.5
const STAGE_CUTOFF_CM = 4.83
const TOTAL_HEIGHT_CM = 13.335 /* Tank */ - 1.27 /* Ranger */

const trigger = new Gpio(pins.ranger_tx, 'out')
const echo = new Gpio(pins.ranger_rx, 'in')
void trigger.write(0)

function sleep (time: number): void {
  const start = performance.now()
  while (performance.now() - start < time);
}

/**
 * @returns Water level in milliliters
 */
export function levelInMilliliters (): number {
  const waterHeight = TOTAL_HEIGHT_CM - readDistance()
  const level = (Math.min(STAGE_CUTOFF_CM, waterHeight) * FIRST_STAGE_ML_PER_CM) + (Math.max(0, waterHeight - STAGE_CUTOFF_CM) * SECOND_STAGE_ML_PER_CM)
  return Math.max(0, level)
}

/**
 * @returns The distance in centimeters
 */
export function readDistance (): number {
  trigger.writeSync(1)
  sleep(50)
  trigger.writeSync(0)

  const inception = performance.now()
  let start = inception
  let end = inception
  while (echo.readSync() === 0 && start - inception < 2e6) start = performance.now()
  while (echo.readSync() === 1 && end - start < 2e6) end = performance.now()

  return (end - start) / 2 / MS_PER_CM
}
