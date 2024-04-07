import { Gpio } from 'onoff'

import { nutrientLevel } from '../server/controllers/nutrientlevel'

import pins from './pins.json' assert { type: 'json' }

// Amount of nutrient solution in mL/min
const OUTPUT_RATE = 1

const pump = new Gpio(pins.nutrient_pump, 'out')
void pump.write(0)

/**
 * @param amount Amount in milliliters
 */
export function releaseAmount (amount: number, onFinish?: () => void): void {
  if (nutrientLevel < amount) {
    console.warn('Tried to release %dL of nutrients. Only had %dmL.', amount, Math.round(nutrientLevel * 100) / 100)
    return
  }

  console.log('Releasing %dmL of nutrients', amount)
  pump.writeSync(1)
  setTimeout(() => {
    console.log('Shutting off nutrient pump')
    void pump.write(0)
    onFinish?.()
  }, (amount / OUTPUT_RATE) * 60000)
}
