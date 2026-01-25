import { useState } from 'react'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="app">
      <header>
        <h1>AI Service Provider Database</h1>
      </header>
      <main>
        <p>Search interface coming soon...</p>
        {/* Voice, Text, and Dropdown components will be added here */}
      </main>
    </div>
  )
}

export default App
