import "../styles/searchbar.css";

function SearchBar({
  username = "",
  setUsername,
  searchPlayer,
  variant = "hero",
  placeholder = "Enter Chess.com username",
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = username.trim();
    if (trimmedName) {
      searchPlayer(trimmedName);
    }
  };

  return (
    <form className={`search-container ${variant}`} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={placeholder}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button type="submit" disabled={!username.trim()}>
        Analyze
      </button>
    </form>
  );
}

export default SearchBar;