import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./Header";
import MainContent from "./MainContents";
import { getFromLocalStorage } from "./localStorage/locaLStorage";
import "./CSS/App.css";

/**
 * The root component of the Application
 *
 * @returns {JSX.Element} JSX element representing the App component
 */
function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const [shows, setShows] = useState(getFromLocalStorage("shows") || []);
	const [favoriteShows, setFavoriteShows] = useState(
		getFromLocalStorage("favoriteShows") || [],
	);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [selectedGenre, setSelectedGenre] = useState("");
	const [filteredShows, setFilteredShows] = useState([]);
	const [seasons, setSeasons] = useState([]);
	const [episodes, setEpisodes] = useState([]);

	/**
	 * Handles the search action by updating the search term state
	 *
	 * @param {string} term -The search term from the user input
	 */
	const handleSearch = (term) => {
		setSearchTerm(term);
	};

	return (
		<div className="app">
			<Header onSearch={handleSearch} />
			<MainContent
				searchTerm={searchTerm}
				onSearch={handleSearch}
				shows={shows}
				setShows={setShows}
				favoriteShows={favoriteShows}
				setFavoriteShows={setFavoriteShows}
				isAuthenticated={isAuthenticated}
				setIsAuthenticated={setIsAuthenticated}
				selectedGenre={selectedGenre}
				setSelectedGenre={setSelectedGenre}
				filteredShows={filteredShows}
				setFilteredShows={setFilteredShows}
				seasons={seasons}
				setSeasons={setSeasons}
				episodes={episodes}
				setEpisodes={setEpisodes}
			/>
		</div>
	);
}

export default App;
