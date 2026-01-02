import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import List from './pages/List'

function App() {
  return (
    <BrowserRouter basename="/">
      <div id="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
