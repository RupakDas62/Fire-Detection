import { useState } from 'react'

import './App.css'
import FireReportForm from './components/FireReportForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FireReportForm />
    </>
  )
}

export default App
