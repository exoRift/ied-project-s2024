import { useCallback, useEffect, useState } from 'react'
import { Cron } from 'react-js-cron'

import 'react-js-cron/dist/styles.css'
import type { Schedule } from '../server/controllers/schedule'

const VOLUME_POLL_INTERVAL = 5000
const MAX_CAPACITY = 2.57175 * 2 * Math.PI * 0.73818

export default function Home (): React.ReactNode {
  const [volume, setVolume] = useState(-1)
  const [cron, setCron] = useState('0 0 * * *')
  const [waterAmount, setWaterAmount] = useState(0)
  const [nutrientAmount, setNutrientAmount] = useState(0)
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    function fetchData (): void {
      void fetch('/api/level', {
        method: 'GET'
      })
        .then(async (res) => {
          if (res.status !== 200) throw Error(await res.text())
          return parseFloat(await res.text())
        })
        .then(setVolume)
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
        setWaterAmount(body.waterAmount)
        setNutrientAmount(body.nutrientAmount)
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
        waterAmount,
        nutrientAmount
      } satisfies Schedule)
    })
      .then((res) => {
        setMessage(res.status === 200 ? 'Saved' : 'An error occurred')

        setTimeout(() => setMessage(undefined), 5000)
      })
  }, [cron, waterAmount, nutrientAmount])

  return (
    <div className='space-y-8'>
      <img src='/assets/images/soleau_banner.png' alt='Soleau' className='w-96' />

      <div>
        <h1 className='text-2xl'>Soleau Aerogation Systems</h1>
        <h2 className='text-xl text-gray-500 italic'>Control Panel</h2>
      </div>

      <div className='flex'>
        <div>
          {volume === -1
            ? 'Loading...'
            : `${Math.round(volume * 100) / 100}/${Math.round(MAX_CAPACITY * 100) / 100} liters`}
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          Release
          {/* TODO: Limit to capacity */}
          <input type='number' value={waterAmount.toString()} onChange={(e) => setWaterAmount(e.currentTarget.valueAsNumber)} className='h-8 border rounded-md w-12' />
          liters of water with
          {/* TODO: Limit to capacity */}
          <input type='number' value={nutrientAmount.toString()} onChange={(e) => setNutrientAmount(e.currentTarget.valueAsNumber)} className='h-8 border rounded-md w-12' />
          milligrams of nutrients
          <Cron value={cron} setValue={setCron} clearButton={false} className='[&_*]:mb-0' />
        </div>

        <button className='bg-blue-400 text-white text-sm p-2 rounded-md' onClick={setSchedule}>Save Changes</button>
      </div>

      {message}
    </div>
  )
}
