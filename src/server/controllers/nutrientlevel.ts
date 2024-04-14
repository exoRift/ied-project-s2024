import type { Middleware } from 'polka'

export let nutrientLevel = 0

export interface ReplenishBody {
  amount: number
}

/**
 * Log a deposit of nutrients in the storage
 */
export const addNutrients: Middleware<any, any, ReplenishBody> = (req, res) => {
  const {
    amount
  } = req.body

  nutrientLevel += amount

  res.tsend(200)
}

/**
 * Get the nutrient level
 */
export const getNutrientLevel: Middleware = (req, res) => {
  res.tsend(200, nutrientLevel.toString())
}
