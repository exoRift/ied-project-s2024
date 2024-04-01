import { Gpio } from 'onoff'

import pins from './pins.json' assert { type: 'json' }

// Amount of liquid in L/min
const OUTPUT_RATE = 1

const pump = new Gpio(pins.irrigation_pump, 'out')
void pump.write(0)

export function irrigate (amount: number): void {
  console.log('Pumping out water to crops')

  pump.writeSync(1)
  setTimeout(() => {
    console.log('Finished pumping')
    void pump.write(0)
  }, amount * OUTPUT_RATE * 60e3)
}

