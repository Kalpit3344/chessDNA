import SearchBar from "./SearchBar";
import searchIcon from "../assests/search-icon.svg";
import "../styles/nav.css";

function Nav({
  username,
  setUsername,
  searchPlayer,
  showNavbarSearch,
  setShowNavbarSearch,
}) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <p id="navlogo">chessDNA</p>
      </div>

      <button
        type="button"
        className="nav-search-toggle"
        onClick={() => setShowNavbarSearch(true)}
        aria-label="Open search"
      >
        <img src={searchIcon} alt="Search" />
      </button>

      {showNavbarSearch && (
        <div className="navbar-search-group">
          <SearchBar
            username={username}
            setUsername={setUsername}
            searchPlayer={searchPlayer}
            variant="navbar"
            placeholder="Enter UserName"
          />
          <button
            type="button"
            className="nav-search-close"
            onClick={() => setShowNavbarSearch(false)}
            aria-label="Close search"
          >
            ✕
          </button>
        </div>
      )}
    </nav>
  );
}

export default Nav;
