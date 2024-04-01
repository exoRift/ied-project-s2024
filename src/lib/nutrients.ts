import { Gpio } from 'onoff'

import { nutrientLevel } from '../server/controllers/nutrients'

// Amount of nutrient solution in L/min
const OUTPUT_RATE = 1
const PUMP_PIN = 15

const pump = new Gpio(PUMP_PIN, 'out')
void pump.write(0)

/**
 * @param amount Amount in liters
 */
export function releaseAmount (amount: number, onFinish?: () => void): void {
  if (nutrientLevel < amount) {
    console.warn('Tried to release %dL of nutrients. Only had %dL.', amount, Math.round(nutrientLevel * 100) / 100)
    return
  }

  console.log('Releasing %dL of nutrients', amount)
  pump.writeSync(1)
  setTimeout(() => {
    console.log('Shutting off nutrient pump')
    void pump.write(0)
    onFinish?.()
  }, (amount / OUTPUT_RATE) * 60000)
}
