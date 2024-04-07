import { type Middleware } from 'polka'

import { levelInMilliliters } from '../../lib/ranger'

/**
 * Get water lvel
 */
export const getWaterLevel: Middleware = (req, res) => {
  try {
    res.tsend(200, levelInMilliliters().toString())
  } catch (err) {
    console.error(err)

    res.tsend(500)
  }
}
