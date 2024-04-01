import { Gpio } from 'onoff'

import pins from './pins.json' assert { type: 'json' }

const motor = new Gpio(pins.mixer_motor, 'out')
void motor.write(0)

export function mixerOn (time: number, onFinish?: () => void): void {
  console.log('Turning on mixing motor')

  motor.writeSync(1)
  setTimeout(() => {
    console.log('Turning off mixing motor')
    void motor.write(0)
    onFinish?.()
  }, time)
}

