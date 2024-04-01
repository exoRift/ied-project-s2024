import { Gpio } from 'onoff'

const MOTOR_PIN = 18

const motor = new Gpio(MOTOR_PIN, 'out')
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

