import { Gpio } from 'onoff'
import { levelInLiters } from './ranger'

// Amount of water in L/min
const OUTPUT_RATE = 1
const PUMP_PIN = 4

const pump = new Gpio(PUMP_PIN, 'out')
void pump.write(0)

/**
 * @param amount Amount in liters
 */
export function releaseAmount (amount: number, onFinish?: () => void): void {
  const level = levelInLiters()

  if (level < amount) {
    console.warn('Tried to release %dL of water. Only had %dL.', amount, Math.round(level * 100) / 100)
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
