import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { searchProviders, getAllProviders } from './lib/supabase'

interface Provider {
  id: string
  company_name: string
  description: string
  business_type: string
  region: string
  website: string
  email: string
  phone: string
  linkedin: string
  data_quality: string
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  // Load initial providers on mount
  useEffect(() => {
    async function loadInitial() {
      setLoading(true)
      const data = await getAllProviders(20)
      setProviders(data)
      setLoading(false)
      setInitialLoad(false)
    }
    loadInitial()
  }, [])

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      const data = await getAllProviders(20)
      setProviders(data)
      return
    }

    setLoading(true)
    const results = await searchProviders(searchQuery)
    setProviders(results)
    setLoading(false)
  }

  return (
    <div className="app">
      <header>
        <h1>AI Service Provider Database</h1>
        <p>Search 1,400+ AI and automation service providers</p>
      </header>

      <main>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search providers... (e.g., 'AI automation Australia', 'marketing consultants')"
              className="search-input"
            />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {loading ? (
          <div className="loading">Searching...</div>
        ) : (
          <div className="results">
            <p className="results-count">
              {providers.length} provider{providers.length !== 1 ? 's' : ''} found
            </p>

            <div className="providers-grid">
              {providers.map((provider) => (
                <div key={provider.id} className="provider-card">
                  <h3>{provider.company_name || 'Unknown Company'}</h3>
                  {provider.business_type && (
                    <span className="badge">{provider.business_type}</span>
                  )}
                  {provider.region && (
                    <span className="badge region">{provider.region}</span>
                  )}
                  {provider.description && (
                    <p className="description">
                      {provider.description.slice(0, 200)}
                      {provider.description.length > 200 ? '...' : ''}
                    </p>
                  )}
                  <div className="contact-links">
                    {provider.website && (
                      <a href={provider.website} target="_blank" rel="noopener noreferrer">
                        Website
                      </a>
                    )}
                    {provider.email && (
                      <a href={`mailto:${provider.email}`}>Email</a>
                    )}
                    {provider.linkedin && (
                      <a href={provider.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {providers.length === 0 && !initialLoad && (
              <p className="no-results">No providers found. Try a different search term.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
