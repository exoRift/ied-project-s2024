import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './Home'

export default function Router (): React.ReactNode {
  return (
    <BrowserRouter>
      <main className='p-4'>
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  )
}
