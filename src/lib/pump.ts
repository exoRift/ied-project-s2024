import { Gpio } from 'onoff'

// Amount of water in L/min
const OUTPUT_RATE = 1
const PUMP_PIN = 4

const pump = new Gpio(PUMP_PIN, 'out')
void pump.write(0)

/**
 * @param amount Amount in liters
 */
export function releaseAmount (amount: number): void {
  pump.writeSync(1)
  setTimeout(() => pump.writeSync(0), (amount / OUTPUT_RATE) * 60000)
}
