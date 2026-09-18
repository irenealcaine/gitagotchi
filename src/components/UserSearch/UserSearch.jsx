import { useState } from "react"
import "./UserSearch.css"

export default function UserSearch({ onSearch, loading }) {
  const [input, setInput] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if (input.trim()) {
      onSearch(input.trim())
    }
  }

  return (
    <div className="user-search">
      <h1 className="user-search-title">Gitagotchi</h1>
      <p className="user-search-subtitle">
        Introduce tu usuario de GitHub para alimentar a tu mascota
      </p>
      <form onSubmit={handleSubmit} className="user-search-form">
        <label className="visually-hidden" htmlFor="github-username">
          Nombre de usuario de GitHub
        </label>
        <input
          id="github-username"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="nombre de usuario..."
          className="user-search-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="user-search-button"
          disabled={loading || !input.trim()}
        >
          {loading ? "Buscando..." : "Alimentar"}
        </button>
      </form>
    </div>
  )
}
