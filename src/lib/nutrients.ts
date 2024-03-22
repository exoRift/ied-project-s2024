import { Gpio } from 'onoff'

// Amount of nutrient solution in L/min
const OUTPUT_RATE = 1
const PUMP_PIN = 14

const pump = new Gpio(PUMP_PIN, 'out')
void pump.write(0)

/**
 * @param amount Amount in liters
 */
export function releaseAmount (amount: number): void {
  console.log('Releasing %dL of nutrients', amount)
  pump.writeSync(1)
  setTimeout(() => {
    console.log('Shutting off nutrient pump')
    pump.writeSync(0)
  }, (amount / OUTPUT_RATE) * 60000)
}
