import { Gpio } from 'onoff'

import pins from './pins.json' assert { type: 'json' }

// Amount of liquid in mL/min
const OUTPUT_RATE = 1441.03954
// 60\left(\frac{\left(\frac{100}{4.55}\right)+\left(\frac{100}{4.4}\right)+\left(\frac{100}{4.22}\right)}{3}+\frac{1.25+1.19+1.21}{3}\right)

const pump = new Gpio(pins.irrigation_pump, 'out')
void pump.write(0)

export function irrigate (amount: number): void {
  console.log('Pumping out %dmL of mixture to crops', Math.round(amount * 100) / 100)

  pump.writeSync(1)
  setTimeout(() => {
    console.log('Finished pumping')
    void pump.write(0)
  }, (amount / OUTPUT_RATE) * 60000)
}

