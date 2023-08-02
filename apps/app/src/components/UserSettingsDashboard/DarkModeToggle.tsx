import React, { useEffect, useState } from 'react'

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkModeEnabled = window.localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDarkModeEnabled)
    document.documentElement.classList.toggle('dark', isDarkModeEnabled)
  }, [])

  const handleToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    window.localStorage.setItem('darkMode', newDarkMode.toString())
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return (
    <button onClick={handleToggle}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}

export default DarkModeToggle
