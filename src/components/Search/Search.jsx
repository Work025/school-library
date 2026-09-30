import { useState } from 'react'
import './Search.css'

function Search({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <form className="search" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <button type="submit">Search</button>
    </form>
  )
}

export default Search