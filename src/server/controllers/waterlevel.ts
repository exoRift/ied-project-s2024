import { type Middleware } from 'polka'

import { levelInLiters } from '../../lib/ranger'

/**
 * Get water lvel
 */
export const getWaterLevel: Middleware = (req, res) => {
  try {
    res.tsend(200, levelInLiters().toString()) /* Volume in liters (cubic decimeters) */
  } catch (err) {
    console.error(err)

    res.tsend(500)
  }
}
