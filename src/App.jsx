import { useState } from 'react'
import TrackWeight from './components/TrackWeight'
import Navbar from './components/Navbar'
import ShowWeight from './components/ShowWeight'
import './App.css'

function App() {  

  const [formData, setFormData] = useState({
    weight: 0 + ' Lbs',
    date: "",
    comment: ""
  })

  function handleChange(event) {
    const {name, value} = event.target

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))
  }

  return (
    <>
    <Navbar/>
    <TrackWeight handleChange={handleChange} formData={formData}/>
    <ShowWeight />
    </>
  )
}

export default App
