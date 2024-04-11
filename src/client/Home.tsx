import { useCallback, useEffect, useState } from 'react'
import { Cron } from 'react-js-cron'

import 'react-js-cron/dist/styles.css'
import type { Schedule } from '../server/controllers/schedule'
import type { ReplenishBody } from '../server/controllers/nutrientlevel'

const VOLUME_POLL_INTERVAL = 2500
const MAX_WATER_CAPACITY_ML = 2000
const MAX_NUTRIENT_CAPACITY_ML = 470

export default function Home (): React.ReactNode {
  // Live stats
  const [waterLevel, setWaterLevel] = useState(-1)
  const [nutrientVolume, setNutrientVolume] = useState(-1)

  // Schedule info
  const [cron, setCron] = useState('0 0 * * *')
  const [waterReleaseAmount, setWaterReleaseAmount] = useState(0)
  const [nutrientReleaseAmount, setNutrientReleaseAmount] = useState(0)
  const [scheduleMessage, setScheduleMessage] = useState<string>()

  // Replenish info
  const [nutrientAddAmount, setNutrientAddAmount] = useState(0)
  const [nutrientMessage, setNutrientMessage] = useState<string>()

  useEffect(() => {
    function fetchData (): void {
      void fetch('/api/level', {
        method: 'GET'
      })
        .then(async (res) => {
          if (res.status !== 200) throw Error(await res.text())
          return parseFloat(await res.text())
        })
        .then(setWaterLevel)

      void fetch('api/nutrients', {
        method: 'GET'
      })
        .then(async (res) => {
          if (res.status !== 200) throw Error(await res.text())
          return parseFloat(await res.text())
        })
        .then(setNutrientVolume)
    }

    const interval = setInterval(fetchData, VOLUME_POLL_INTERVAL)
    fetchData()

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const aborter = new AbortController()

    void fetch('/api/schedule', {
      method: 'GET'
    })
      .then(async (res) => {
        if (res.status !== 200) throw Error(await res.text())
        return await res.json()
      })
      .then((body: Schedule) => {
        setCron(body.cron)
        setWaterReleaseAmount(body.waterAmount)
        setNutrientReleaseAmount(body.nutrientAmount)
      })

    return () => aborter.abort()
  }, [])

  const setSchedule = useCallback(() => {
    void fetch('/api/schedule', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cron,
        waterAmount: waterReleaseAmount,
        nutrientAmount: nutrientReleaseAmount
      } satisfies Schedule)
    })
      .then((res) => {
        setScheduleMessage(res.status === 200 ? 'Saved' : 'An error occurred')

        setTimeout(() => setScheduleMessage(undefined), 5000)
      })
  }, [cron, waterReleaseAmount, nutrientReleaseAmount])

  const replenishNutrients = useCallback(() => {
    void fetch('/api/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: nutrientAddAmount
      } satisfies ReplenishBody)
    })
      .then((res) => {
        setNutrientVolume((prior) => prior + nutrientAddAmount)
        setNutrientMessage(res.status === 200 ? 'Added nutrients' : 'An error occurred')

        setTimeout(() => setNutrientMessage(undefined), 5000)
      })
  }, [cron, waterReleaseAmount, nutrientReleaseAmount])

  return (
    <div className='space-y-8'>
      <img src='/assets/images/soleau_banner.png' alt='Soleau' className='w-96' />

      <div>
        <h1 className='text-2xl'>Soleau Aerogation Systems</h1>
        <h2 className='text-xl text-gray-500 italic'>Control Panel</h2>
      </div>

      <div>
        {waterLevel === -1
          ? 'Loading...'
          : `Water: ${Math.round(waterLevel * 100) / 100}/${Math.round(MAX_WATER_CAPACITY_ML * 100) / 100} milliliters`}
      </div>

      <div className='space-y-2'>
        <div className='flex max-sm:flex-col sm:items-center gap-2'>
          Release
          <input type='number' min={0} max={MAX_WATER_CAPACITY_ML} value={waterReleaseAmount.toString()} onChange={(e) => setWaterReleaseAmount(e.currentTarget.valueAsNumber)} className='h-8 border rounded-md w-12' />
          milliliters of water with
          <input type='number' min={0} max={MAX_NUTRIENT_CAPACITY_ML} value={nutrientReleaseAmount.toString()} onChange={(e) => setNutrientReleaseAmount(e.currentTarget.valueAsNumber)} className='h-8 border rounded-md w-12' />
          milliliters of nutrients
          <Cron value={cron} setValue={setCron} clearButton={false} className='[&_*]:mb-0' />
        </div>

        <button className='bg-blue-400 text-white text-sm p-2 rounded-md' onClick={setSchedule}>Save Changes</button>
      </div>

      {scheduleMessage}

      <div className='!mt-12'>
        {nutrientVolume === -1
          ? 'Loading...'
          : `Nutrients: ${Math.round(nutrientVolume * 100) / 100}/${Math.round(MAX_NUTRIENT_CAPACITY_ML * 100) / 100} milliliters`}
      </div>

      <div className='space-y-2'>
        Replenish amount of nutrients in storage (milliliters)
        <input type='number' min={0} max={MAX_NUTRIENT_CAPACITY_ML - nutrientVolume} value={nutrientAddAmount.toString()} onChange={(e) => setNutrientAddAmount(e.currentTarget.valueAsNumber)} className='block h-8 border rounded-md w-12' />
        <button className='block bg-blue-400 text-white text-sm p-2 rounded-md' onClick={replenishNutrients}>Record Refill</button>

        {nutrientMessage}
      </div>
    </div>
  )
}
