import { Gpio } from 'onoff'

// The time it takes for sound to travel at STP
const MILLISECONDS_PER_DECIMETER = 100 / 343 /* speed [m/s] ^-1 * 1000 / 10 */

// Container dimensions
// Declieters
const RADIUS = 0.73818 /* \frac{5+\frac{13}{16}}{2}\cdot 0.254 */
const HEIGHT = 2.57175 /* \left(10+\frac{1}{8}\right)\cdot 0.254 */

const TX = 3
const RX = 2

const trigger = new Gpio(TX, 'out')
const echo = new Gpio(RX, 'in')
void trigger.write(0)

function sleep (time: number): void {
  const start = performance.now()
  while (performance.now() - start < time);
}

/**
 * @returns Water level in liters
 */
export function levelInLiters (): number {
  return 2 * Math.PI * RADIUS * (HEIGHT - readDistance())
}

/**
 * @returns The distance in decimeters
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

  return (end - start) / 2 / MILLISECONDS_PER_DECIMETER
}
