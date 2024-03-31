import type { Middleware } from 'polka'

export let nutrientLevel = 0

export interface ReplenishBody {
  amount: number
}

export const addNutrients: Middleware<any, any, ReplenishBody> = (req, res) => {
  const {
    amount
  } = req.body

  nutrientLevel += amount

  res.tsend(200)
}

export const getNutrientLevel: Middleware = (req, res) => {
  res.tsend(200, nutrientLevel)
}
