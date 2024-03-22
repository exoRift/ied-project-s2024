import { useEffect, useState } from 'react'
import { Cron } from 'react-js-cron'

import 'react-js-cron/dist/styles.css'

const VOLUME_POLL_INTERVAL = 1000
const MAX_CAPACITY = 2.57175 * 2 * Math.PI * 0.73818

export default function Home (): React.ReactNode {
  const [volume, setVolume] = useState(-1)
  const [cron, setCron] = useState('')

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

  // useEffect(() => {
  //   const aborter = new AbortController()

  //   void fetch('/api/schedule', {
  //     method: 'GET'
  //   })
  //     .then(async (res) => {
  //       if (res.status !== 200) throw Error(await res.text())
  //       return await res.json()
  //     })
  //     .then(() => {
        
  //     })

  //   return () => aborter.abort()
  // }, [])

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

      <Cron value={cron} setValue={setCron} />
    </div>
  )
}
