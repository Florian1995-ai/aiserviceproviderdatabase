import { useState } from 'react'
import { Search, MapPin, Briefcase, X, Building2, Target } from 'lucide-react'

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
  use_cases?: string[]
  business_functions?: string[]
  industries_served?: string[]
  similarity?: number
}

// Canonical taxonomy from classification (Feb 2026)
const USE_CASES = [
  'Voice AI',
  'Agentic AI',
  'CRM & Sales Automation',
  'Workflow & Process Automation',
  'AI Content & Marketing',
  'RAG & Knowledge Bases',
  'Data Dashboards & Analytics',
  'Document & Data Processing',
  'Custom AI Development',
  'On-Premise & Private AI',
  'AI Web & App Design',
  'AI Consulting & Education',
]

const BUSINESS_FUNCTIONS = [
  'Marketing',
  'Sales',
  'Customer Service',
  'Operations',
  'Finance',
  'People / HR',
  'Leadership / Strategy',
  'Legal / Compliance',
]

const INDUSTRIES = [
  'E-commerce / Retail',
  'SaaS / Technology',
  'Healthcare / Medical',
  'Financial Services / Insurance',
  'Real Estate',
  'Legal Services',
  'Education / EdTech',
  'Construction / Trades / Home Services',
  'Professional Services / Consulting',
  'Media / Entertainment',
  'Cybersecurity',
  'Government / Public Sector',
  'Manufacturing / Logistics',
  'Hospitality / Travel / Food Services',
  'Industry Agnostic',
]

const REGIONS = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East',
  'Africa',
  'Remote / Other',
]

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [resultCount, setResultCount] = useState(0)
  const [suggestRelaxFilters, setSuggestRelaxFilters] = useState(false)

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedUseCase, setSelectedUseCase] = useState('')
  const [selectedBusinessFunction, setSelectedBusinessFunction] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')

  // Call the Supabase Edge Function for vector search
  const performSearch = async () => {
    setLoading(true)
    setSuggestRelaxFilters(false)

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          query: searchQuery,
          filters: {
            useCase: selectedUseCase || null,
            businessFunction: selectedBusinessFunction || null,
            industry: selectedIndustry || null,
            region: selectedRegion || null,
            limit: 100,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const result = await response.json()
      setProviders(result.results || [])
      setResultCount(result.count || 0)
      setSuggestRelaxFilters(result.suggestRelaxFilters || false)
    } catch (error) {
      console.error('Search error:', error)
      setProviders([])
      setResultCount(0)
    }

    setLoading(false)
  }

  // Handle search form submit
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    performSearch()
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedRegion('')
    setSelectedUseCase('')
    setSelectedBusinessFunction('')
    setSelectedIndustry('')
    setProviders([])
    setResultCount(0)
    setSuggestRelaxFilters(false)
  }

  const hasActiveFilters = searchQuery || selectedRegion || selectedUseCase || selectedBusinessFunction || selectedIndustry

  return (
    <div className="app">
      <header>
        <h1>AI Service Provider Database</h1>
        <p>Search 3,900+ AI and automation service providers by use case, industry, and location</p>
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
              placeholder="Search by service, keyword, or describe what you need... (e.g., 'voice AI for real estate', 'CRM automation')"
              className="search-input"
            />
          </div>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="filters">
          <div className="filter-group">
            <label>
              <Target size={16} />
              AI Use Case
            </label>
            <select
              value={selectedUseCase}
              onChange={(e) => setSelectedUseCase(e.target.value)}
            >
              <option value="">All Use Cases</option>
              {USE_CASES.map(uc => (
                <option key={uc} value={uc}>{uc}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Building2 size={16} />
              Business Function
            </label>
            <select
              value={selectedBusinessFunction}
              onChange={(e) => setSelectedBusinessFunction(e.target.value)}
            >
              <option value="">All Functions</option>
              {BUSINESS_FUNCTIONS.map(bf => (
                <option key={bf} value={bf}>{bf}</option>
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
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

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

          {hasActiveFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              <X size={16} />
              Clear All
            </button>
          )}
        </div>

        {/* Relaxed filter suggestion */}
        {suggestRelaxFilters && (
          <div className="filter-suggestion">
            Too few results. Try removing some filters to see more providers.
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="loading">Searching providers...</div>
        ) : resultCount > 0 ? (
          <div className="results">
            <p className="results-count">
              {resultCount} provider{resultCount !== 1 ? 's' : ''} found
              {hasActiveFilters && ' (filtered)'}
            </p>

            <div className="providers-grid">
              {providers.map((provider) => (
                <div key={provider.id} className="provider-card">
                  <div className="card-header">
                    <h3>{provider.name || 'Unknown'}</h3>
                    {provider.similarity !== undefined && (
                      <span className="relevance-score" title="Relevance score">
                        {Math.round(provider.similarity * 100)}% match
                      </span>
                    )}
                  </div>

                  <div className="badges">
                    {provider.country && (
                      <span className="badge location">
                        <MapPin size={12} />
                        {provider.city ? `${provider.city}, ` : ''}{provider.country}
                      </span>
                    )}
                  </div>

                  {/* Taxonomy badges */}
                  {provider.use_cases && provider.use_cases.length > 0 && (
                    <div className="taxonomy-badges">
                      <strong>Use Cases:</strong>
                      <div className="badge-list">
                        {provider.use_cases.slice(0, 3).map(uc => (
                          <span key={uc} className="badge use-case">{uc}</span>
                        ))}
                        {provider.use_cases.length > 3 && (
                          <span className="badge-more">+{provider.use_cases.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {provider.business_functions && provider.business_functions.length > 0 && (
                    <div className="taxonomy-badges">
                      <strong>Functions:</strong>
                      <div className="badge-list">
                        {provider.business_functions.slice(0, 3).map(bf => (
                          <span key={bf} className="badge function">{bf}</span>
                        ))}
                        {provider.business_functions.length > 3 && (
                          <span className="badge-more">+{provider.business_functions.length - 3}</span>
                        )}
                      </div>
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

          </div>
        ) : hasActiveFilters ? (
          <p className="no-results">No providers found. Try adjusting your filters or search term.</p>
        ) : (
          <div className="welcome-message">
            <p>Welcome! Use the search and filters above to find AI service providers.</p>
            <p>Try searching for "voice AI", "CRM automation", or select a use case from the dropdown.</p>
          </div>
        )}
      </main>

      <footer>
        <p>Data last updated: February 2026 | 3,900+ verified AI service providers</p>
        <p>Powered by vector similarity search with LLM-classified taxonomy</p>
      </footer>
    </div>
  )
}

export default App
