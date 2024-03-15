import { type Middleware } from 'polka'
import { HCSR04 } from 'hc-sr04'

const TX = 0
const RX = 2

const ranger = new HCSR04(TX, RX)

export const level: Middleware = (req, res) => {
  try {
    res.tsend(200, ranger.distance())
  } catch {
    res.tsend(500)
  }
}

while (true) {
  console.log(ranger.distance())
}
