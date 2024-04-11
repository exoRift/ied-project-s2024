import { Gpio } from 'onoff'

import { levelInMilliliters } from './ranger'

import pins from './pins.json' assert { type: 'json' }

// Amount of water in mL/min
const OUTPUT_RATE = 0.40028
// \frac{\frac{\left(\frac{100}{4.55}\right)+\left(\frac{100}{4.4}\right)+\left(\frac{100}{4.22}\right)}{3}+\frac{1.25+1.19+1.21}{3}}{60}

const pump = new Gpio(pins.dehumidifer_pump, 'out')
void pump.write(0)

/**
 * @param amount Amount in milliliters
 */
export function releaseAmount (amount: number, onFinish?: () => void): void {
  const level = levelInMilliliters()

  if (level < amount) {
    console.warn('Tried to release %dmL of water. Only had %dmL.', amount, Math.round(level * 100) / 100)
    return
  }

  console.log('Releasing %dL of water', amount)
  pump.writeSync(1)
  setTimeout(() => {
    console.log('Shutting off water pump')
    void pump.write(0)
    onFinish?.()
  }, (amount / OUTPUT_RATE) * 60000)
}
