import { useEffect, useState } from 'react'

const VOLUME_POLL_INTERVAL = 1000
const MAX_CAPACITY = 2.57175 * 2 * Math.PI * 0.73818

export default function Home (): React.ReactNode {
  const [volume, setVolume] = useState(-1)

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

  return (
    <div className='space-y-8'>
      <img src='/assets/images/soleau_banner.png' alt='Soleau' className='w-96' />

      <div>
        <h1 className='text-2xl'>Soleau Aerogation Systems</h1>
        <h2 className='text-xl text-gray italic'>Control Panel</h2>
      </div>

      <div className='flex'>
        <div>
          {volume === -1
            ? 'Loading...'
            : `${Math.round(volume * 100) / 100}/${Math.round(MAX_CAPACITY * 100) / 100} liters`}
        </div>
      </div>
    </div>
  )
}
