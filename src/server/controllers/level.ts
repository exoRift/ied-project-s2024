import { type Middleware } from 'polka'

import { readDistance } from '../../lib/ranger'

// Decieters
const RADIUS = 0.73818 /* \frac{5+\frac{13}{16}}{2}\cdot 0.254 */
const HEIGHT = 2.57175 /* \left(10+\frac{1}{8}\right)\cdot 0.254 */

/**
 * Get water lvel
 */
export const level: Middleware = (req, res) => {
  try {
    res.tsend(200, String(2 * Math.PI * RADIUS * (HEIGHT - readDistance()))) /* Volume in liters (cubic decimeters) */
  } catch (err) {
    console.error(err)

    res.tsend(500)
  }
}
