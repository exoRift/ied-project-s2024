import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './Home'

export default function Router (): React.ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
