import { useState, useEffect } from 'react'
import { Search, MapPin, Briefcase, Cpu, X } from 'lucide-react'
import { supabase } from './lib/supabase'

interface Provider {
  id: string
  name: string
  city: string
  country: string
  region: string
  website: string
  linkedin: string
  skool: string
  email: string
  phone: string
  services: string
  industries: string
  pricing: string
  semantic_summary: string
  data_quality: string
}

// Curated AI Services categories
const AI_SERVICES = [
  'AI Automation',
  'AI Chatbots',
  'AI Agents',
  'AI Consulting',
  'AI Integration',
  'Machine Learning',
  'Content Automation',
  'Marketing Automation',
  'Sales Automation',
  'Workflow Automation',
  'Data Analytics',
  'Process Automation',
  'Voice AI',
  'AI Development',
  'GPT / LLM Solutions'
]

// Regions for filtering
const REGIONS = ['US', 'Canada', 'UK', 'Australia/NZ', 'Other']

// Map country names to regions
function getRegion(country: string): string {
  if (!country) return 'Other'
  const c = country.toLowerCase().trim()

  // US variations
  if (c === 'united states' || c === 'usa' || c === 'us' || c === 'united states of america') {
    return 'US'
  }
  // Canada
  if (c === 'canada') {
    return 'Canada'
  }
  // UK variations
  if (c === 'united kingdom' || c === 'uk' || c === 'england' || c === 'great britain' || c === 'scotland' || c === 'wales' || c === 'northern ireland') {
    return 'UK'
  }
  // Australia/NZ
  if (c === 'australia' || c === 'new zealand' || c === 'nz') {
    return 'Australia/NZ'
  }

  return 'Other'
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [providers, setProviders] = useState<Provider[]>([])
  const [allData, setAllData] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedAIService, setSelectedAIService] = useState('')

  // Unique values for dropdowns
  const [industries, setIndustries] = useState<string[]>([])

  // Load initial data
  useEffect(() => {
    async function loadInitial() {
      setLoading(true)

      try {
        // Fetch all data
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .limit(1500)

        if (error) {
          console.error('Fetch error:', error)
          setLoading(false)
          return
        }

        if (data && data.length > 0) {
          setAllData(data)
          setProviders(data.slice(0, 50))

          // Extract TOP 10 industries (by frequency)
          const industryCount: Record<string, number> = {}
          data.forEach(p => {
            if (p.industries) {
              p.industries.split(',').forEach((ind: string) => {
                const trimmed = ind.trim()
                if (trimmed && trimmed.length > 2) {
                  industryCount[trimmed] = (industryCount[trimmed] || 0) + 1
                }
              })
            }
          })
          const top10Industries = Object.entries(industryCount)
            .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
            .slice(0, 10)
            .map(([industry]: [string, number]) => industry)
          setIndustries(top10Industries)

          console.log(`Loaded ${data.length} providers`)
        }
      } catch (err) {
        console.error('Load error:', err)
      }

      setLoading(false)
      setInitialLoad(false)
    }
    loadInitial()
  }, [])

  // Filter function - runs client-side for speed
  const applyFilters = () => {
    let filtered = [...allData]

    // Text search (searches multiple fields)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        (p.name || '').toLowerCase().includes(query) ||
        (p.semantic_summary || '').toLowerCase().includes(query) ||
        (p.services || '').toLowerCase().includes(query) ||
        (p.industries || '').toLowerCase().includes(query) ||
        (p.city || '').toLowerCase().includes(query) ||
        (p.country || '').toLowerCase().includes(query)
      )
    }

    // Region filter
    if (selectedRegion) {
      filtered = filtered.filter(p => getRegion(p.country) === selectedRegion)
    }

    // Industry filter
    if (selectedIndustry) {
      filtered = filtered.filter(p =>
        (p.industries || '').toLowerCase().includes(selectedIndustry.toLowerCase())
      )
    }

    // AI Service filter (searches in services and semantic_summary)
    if (selectedAIService) {
      const serviceQuery = selectedAIService.toLowerCase()
      filtered = filtered.filter(p =>
        (p.services || '').toLowerCase().includes(serviceQuery) ||
        (p.semantic_summary || '').toLowerCase().includes(serviceQuery)
      )
    }

    setProviders(filtered.slice(0, 100))
  }

  // Handle search form submit
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    applyFilters()
  }

  // Apply filters when any filter changes
  useEffect(() => {
    if (!initialLoad && allData.length > 0) {
      applyFilters()
    }
  }, [selectedRegion, selectedIndustry, selectedAIService, searchQuery])

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedRegion('')
    setSelectedIndustry('')
    setSelectedAIService('')
    setProviders(allData.slice(0, 50))
  }

  const hasActiveFilters = searchQuery || selectedRegion || selectedIndustry || selectedAIService

  return (
    <div className="app">
      <header>
        <h1>AI Service Provider Database</h1>
        <p>Search 1,400+ AI and automation service providers by industry, services, and location</p>
      </header>

      <main>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, service, or keyword... (e.g., 'blog automation', 'chatbot')"
              className="search-input"
            />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="filters">
          <div className="filter-group">
            <label>
              <MapPin size={16} />
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">All Regions</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Briefcase size={16} />
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Cpu size={16} />
              AI Service Type
            </label>
            <select
              value={selectedAIService}
              onChange={(e) => setSelectedAIService(e.target.value)}
            >
              <option value="">All AI Services</option>
              {AI_SERVICES.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading">Loading providers...</div>
        ) : (
          <div className="results">
            <p className="results-count">
              {providers.length} provider{providers.length !== 1 ? 's' : ''} found
              {hasActiveFilters && ' (filtered)'}
              {providers.length === 100 && ' — showing first 100'}
            </p>

            <div className="providers-grid">
              {providers.map((provider) => (
                <div key={provider.id} className="provider-card">
                  <h3>{provider.name || 'Unknown'}</h3>

                  <div className="badges">
                    {provider.country && (
                      <span className="badge location">
                        <MapPin size={12} />
                        {provider.city ? `${provider.city}, ` : ''}{provider.country}
                      </span>
                    )}
                    {provider.industries && (
                      <span className="badge industry" title={provider.industries}>
                        {provider.industries.split(',')[0].trim()}
                        {provider.industries.includes(',') && '...'}
                      </span>
                    )}
                  </div>

                  {provider.services && (
                    <div className="services">
                      <strong>Services:</strong> {provider.services.slice(0, 150)}
                      {provider.services.length > 150 ? '...' : ''}
                    </div>
                  )}

                  {provider.semantic_summary && (
                    <p className="description">
                      {provider.semantic_summary.slice(0, 250)}
                      {provider.semantic_summary.length > 250 ? '...' : ''}
                    </p>
                  )}

                  <div className="contact-links">
                    {provider.website && (
                      <a href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`} target="_blank" rel="noopener noreferrer">
                        Website
                      </a>
                    )}
                    {provider.linkedin && (
                      <a href={provider.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    )}
                    {provider.email && (
                      <a href={`mailto:${provider.email}`}>Email</a>
                    )}
                    {provider.skool && (
                      <a href={provider.skool} target="_blank" rel="noopener noreferrer">
                        Skool
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {providers.length === 0 && !initialLoad && (
              <p className="no-results">No providers found. Try adjusting your filters or search term.</p>
            )}
          </div>
        )}
      </main>

      <footer>
        <p>Data last updated: January 2025 | {allData.length > 0 ? allData.length.toLocaleString() : '1,400'}+ verified AI service providers</p>
      </footer>
    </div>
  )
}

export default App
