import { useEffect, useState } from "react";
import logo from "./favicons/radio-outline.svg";
import { genres } from "./genreMapping";
import {
	saveToLocalStorage,
	getFromLocalStorage,
} from "./localStorage/locaLStorage";
import { Authentication } from "./Authentication";
import { supabase } from "./supabase";
import Feedback from "./Feedback";
import Fuse from "fuse.js";
import { fuseOptions } from "./FuseOptions";
import Slider from "react-slick";
import { carouselSettings } from "./Corousel";
import generateUUID from "./uuidGen";
import { CheckboxItem } from "./checkbox";
import { resetProgress } from "./resetProg";
import { Loading } from "./Loading";
import PropTypes from "prop-types";
import FavoriteEpisodes from "./FavoriteEpisodes";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.css";
import "./CSS/App.css";

/**
 * This component displays the App Elements to the HTML
 *
 * @returns {JSX.Element}  JSX Element representing the MainContents component
 */
export default function MainContent(props) {
	const {
		shows,
		setShows,
		favoriteShows,
		setFavoriteShows,
		isAuthenticated,
		setIsAuthenticated,
		selectedGenre,
		setSelectedGenre,
		seasons,
		setSeasons,
		episodes,
		setEpisodes,
		filteredShows,
		setFilteredShows,
	} = props;

	const [loading, setLoading] = useState(true);
	const [searchValue, setSearchValue] = useState("");
	const [images, setImages] = useState([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [showEpisodesDescription, setShowEpisodesDescription] = useState(false);
	const [favoriteShowsModalOpen, setFavoriteShowsModalOpen] = useState(false);
	const [favoriteShowsTime, setFavoriteShowsTime] = useState(
		getFromLocalStorage("favoriteShowsTime") || [],
	);
	const [sortOrder, setSortOrder] = useState("asc");
	const [isMinimized, setIsMinimized] = useState(false);
	const [publicUrl, setPublicUrl] = useState("");
	const [publicUrlOpen, setPublicUrlOpen] = useState(false);
	const [favCheckboxes, setFavCheckboxes] = useState(
		getFromLocalStorage() || {},
	);
	const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);

	useEffect(() => {
		const userToken = getFromLocalStorage("userToken");
		if (userToken) {
			setIsAuthenticated(true);
		}
	}, [setIsAuthenticated]);

	/**
	 * useEffect Hook to fetch shows data from API
	 */
	useEffect(() => {
		fetch("https://podcast-api.netlify.app/shows")
			.then((res) => res.json())
			.then((data) => {
				setShows(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setLoading(false);
			});
	}, [setShows]);

	useEffect(() => {
		saveToLocalStorage("favCheckboxes", JSON.stringify(favCheckboxes));
	}, [favCheckboxes]);

	/**
	 * Toggle the "show more" state of a show/preview's description
	 *
	 * @param {number} showId -The ID of the show / preview to toggle
	 */
	const toggleShowMore = (showId) => {
		const updatedShows = shows.map((show) => {
			if (show.id === showId) {
				return {
					...show,
					showFullDescription: !show.showFullDescription,
				};
			}
			return show;
		});

		const updatedFilteredShows = filteredShows.map((show) => {
			if (show.id === showId) {
				return {
					...show,
					showFullDescription: !show.showFullDescription,
				};
			}
			return show;
		});
		setShows(updatedShows);
		setFilteredShows(updatedFilteredShows);
		saveToLocalStorage("shows", updatedShows);
	};

	/**
	 * Handles the click event on a show/preview to fetch its episodes
	 *
	 * @param {number} showId - The ID of the show / preview
	 */
	const handleShowClick = async (showId) => {
		try {
			setLoading(true);
			const response = await fetch(
				`https://podcast-api.netlify.app/id/${showId}`,
			);

			if (response.ok) {
				const data = await response.json();
				const seasons = data.seasons;
				const imgs = data.image;
				const allEpisodes = [];
				const allSeasons = [];
				seasons.forEach((season, index) => {
					const seasonNumber = index + 1;
					allSeasons.push(`Season ${seasonNumber}`);
					season.episodes.forEach((episode) => {
						allEpisodes.push({
							...episode,
							season: seasonNumber,
						});
					});
				});
				setEpisodes(allEpisodes);
				setSeasons(allSeasons);
				setImages(imgs);
				setDialogOpen(true);
			} else {
				throw new Error(`Error: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	//-------------------------------------------------------------------------
	/**
	 * Handles Sign-In
	 */
	const handleSignIn = () => {
		setIsAuthenticated(true);
		sessionStorage.setItem("isAuthenticated", "true");
	};

	useEffect(() => {
		const userToken = getFromLocalStorage("userToken");
		const isAuthenticated =
			sessionStorage.getItem("isAuthenticated") === "true";

		if (userToken || isAuthenticated) {
			setIsAuthenticated(true);
		}
		setLoading(true);
	}, [setIsAuthenticated]);

	if (!isAuthenticated) {
		return <Authentication onSignIn={handleSignIn} />;
	}

	/**
	 * Retrieves the names of genres based on their codes.
	 *
	 * @param {number[]} genreCodes - An array of genre codes.
	 * @returns {string} - The names of the genres joined by commas, or 'Unknown Genre' if a genre is not found.
	 */
	function getGenreName(genreCodes) {
		const genreNames = genreCodes.map((code) => {
			const genre = genres.find((genre) => genre.code === code);
			return genre ? genre.name : "Unknown Genre";
		});
		return genreNames.join(" , "); // Join the genre names with a comma separator
	}

	/**
	 * Handles the input change events for search and genre filters.
	 *
	 * Also pulled in fuse.js for fuzzy seaching
	 *
	 * @param {Event} event - The input change event object.
	 * @param {string} event.target.name - The name attribute of the input element.
	 * @param {string} event.target.value - The value entered or selected in the input element.
	 */
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		if (name === "search") {
			const fuse = new Fuse(shows, fuseOptions);
			const searchResults = fuse.search(value);
			const filteredShows = searchResults.map((result) => result.item);
			setFilteredShows(filteredShows);
			setSearchValue(value);
		} else if (name === "genre") {
			setSelectedGenre(value);
		}
	};

	/**
	 * Handle form submission and filtering of shows based on search criteria and sorting options.
	 *
	 * @param {Event} event - The form submission event object.
	 * @param {string} sortBy - The sorting option selected. Possible values: 'titleAsc', 'titleDesc', 'dateAsc', 'dateDesc'.
	 * @returns {void}
	 */
	const handleSubmit = (event, sortBy) => {
		event.preventDefault();
		const filtered = shows.filter((show) => {
			const titleLowerCase = show.title.toLowerCase();
			const searchValueLowerCase = searchValue.toLowerCase();
			const firstCharOfTitle = titleLowerCase.charAt(0);
			const firstCharOfSearchValue = searchValueLowerCase.charAt(0);

			const titleMatch =
				titleLowerCase.includes(searchValueLowerCase) ||
				firstCharOfTitle === firstCharOfSearchValue;
			const genreMatch =
				selectedGenre === "" || show.genres.includes(Number(selectedGenre));
			return titleMatch && genreMatch;
		});
		setFilteredShows(filtered);

		switch (sortBy) {
			case "titleAsc":
				filtered.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "titleDesc":
				filtered.sort((a, b) => b.title.localeCompare(a.title));
				break;
			case "dateAsc":
				filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
				break;
			case "dateDesc":
				filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
				break;
			default:
				break;
		}
		setFilteredShows(filtered);
	};
	//--------------------------------------------------------

	/**
	 * Handles toggling the favorite status of a show
	 *
	 * @param {number} showId - The ID of the show
	 */
	const handleToggleFavorite = async (showId) => {
		const isFavorite = favoriteShows.includes(showId);
		let updatedFavorites;

		if (isFavorite) {
			updatedFavorites = favoriteShows.filter((id) => id !== showId);
			const updatedFavoriteShowsTime = { ...favoriteShowsTime };
			delete updatedFavoriteShowsTime[showId];
			setFavoriteShowsTime(updatedFavoriteShowsTime);
		} else {
			updatedFavorites = [...favoriteShows, showId];
			const currentTime = new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
			setFavoriteShowsTime((prevFavoriteShowsTime) => ({
				...prevFavoriteShowsTime,
				[showId]: currentTime,
			}));
		}
		setFavoriteShows(updatedFavorites);
		saveToLocalStorage("favoriteShows", updatedFavorites);
		saveToLocalStorage("favoriteShowsTime", favoriteShowsTime);

		const favTitles = favoriteShows.map((showId) => {
			const show = shows.find((show) => show.id === showId);
			return show ? show.title : "";
		});

		try {
			const { data, error } = await supabase
				.from("The Audio Lounge")
				.upsert({ showId: JSON.stringify(favTitles) }, { showId });

			if (error) {
				throw new Error(error.message);
			} else {
				data;
			}
		} catch (error) {
			console.error(error.message);
		}
	};

	/**
	 * Sorts the favorite shows based on their title and updated date and sorting order
	 *
	 * @param {number[]} favoriteShows - An array of favorite show IDs.
	 * @param {object[]} shows - An array of all shows data.
	 * @param {string} sortBy - The sorting option selected. Possible values: 'titleAsc', 'titleDesc', 'dateAsc', 'dateDesc'.
	 * @returns {object[]} - The favorite shows sorted based on the selected sorting option.
	 */
	function sortFavoriteShows(favoriteShows, shows, sortBy) {
		let sortedFavoriteShows;
		switch (sortBy) {
			case "titleAsc":
				sortedFavoriteShows = favoriteShows
					.map((showId) => shows.find((show) => show.id === showId))
					.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "titleDesc":
				sortedFavoriteShows = favoriteShows
					.map((showId) => shows.find((show) => show.id === showId))
					.sort((a, b) => b.title.localeCompare(a.title));
				break;
			case "dateAsc":
				sortedFavoriteShows = favoriteShows
					.map((showId) => shows.find((show) => show.id === showId))
					.sort((a, b) => new Date(a.updated) - new Date(b.updated));
				break;
			case "dateDesc":
				sortedFavoriteShows = favoriteShows
					.map((showId) => shows.find((show) => show.id === showId))
					.sort((a, b) => new Date(b.updated) - new Date(a.updated));
				break;
			default:
				sortedFavoriteShows = favoriteShows
					.map((showId) => shows.find((show) => show.id === showId))
					.sort((a, b) => a.title.localeCompare(b.title));
				break;
		}

		return sortedFavoriteShows;
	}

	/**
	 * Opens or closes the modal displaying favorite TV shows.
	 *
	 */
	const openFavoriteShowsModal = () => {
		setFavoriteShowsModalOpen((prevState) => !prevState);
	};

	/**
	 * Handles the change event when the user selects a different sort order.
	 *
	 * @param {Event} event - The change event object.
	 * @param {string} event.target.value - The value of the selected sort order.
	 */
	const handleSortOrderChange = (event) => {
		const sortOrder = event.target.value;
		setSortOrder(sortOrder);
	};

	/**
	 * Closes the dialog if it is not minimized.
	 * Prompts the user for confirmation before closing the dialog.
	 *
	 */
	const closeDialog = () => {
		if (!isMinimized) {
			const response = prompt("Do you want to close the episode?");
			if (response === "" || response.toLowerCase() === "ok") {
				setDialogOpen(false);
			}
		}
	};

	/**
	 * Function to handle checkbox change for individual checkboxes
	 * @param {string} checkboxId - The ID of the checkbox
	 */
	const handleCheckboxChange = (checkboxId) => (event) => {
		const { checked } = event.target;
		setFavCheckboxes((prevCheckboxes) => ({
			...prevCheckboxes,
			[checkboxId]: checked,
		}));

		const index = parseInt(checkboxId.split("-")[1]);
		if (checked) {
			setFavoriteEpisodes((prevFavoriteEpisodes) => [
				...prevFavoriteEpisodes,
				episodes[index],
			]);
		} else {
			setFavoriteEpisodes((prevFavoriteEpisodes) =>
				prevFavoriteEpisodes.filter((episode) => episode !== episodes[index]),
			);
		}
	};

	const handleAudioSelection = (event) => {
		if (event.target.tagName === "AUDIO") {
			const selectedAudio = event.target;
			const selectedAudioId = event.target.id;

			const saveAudioProgress = () => {
				const duration = selectedAudio.duration;
				const currentTime = selectedAudio.currentTime;
				const progressPercentage = (currentTime / duration) * 100;
				saveToLocalStorage(`currentTime-${selectedAudioId}`, currentTime);
				saveToLocalStorage(
					`progressPercentage-${selectedAudioId}`,
					progressPercentage,
				);
			};

			selectedAudio.addEventListener("pause", saveAudioProgress);
			window.addEventListener("unload", saveAudioProgress);

			(async () => {
				try {
					const savedCurrentTime = await getFromLocalStorage(
						`currentTime-${selectedAudioId}`,
					);
					const savedProgressPercentage = await getFromLocalStorage(
						`progressPercentage-${selectedAudioId}`,
					);
					if (savedCurrentTime !== null && savedProgressPercentage !== null) {
						selectedAudio.currentTime = parseFloat(savedCurrentTime);
					}
				} catch (error) {
					console.error("Error fetching data from localStorage:", error);
				}
			})();
		}
	};

	const generatePublicURL = () => {
		const favTitles = favoriteShows.map((showId) => {
			const show = shows.find((show) => show.id === showId);
			return show ? show.title : "";
		});

		const favoritesParam = favTitles.join(",");
		const baseUrl = window.location.href.split("?")[0];
		const publicUrl = `${baseUrl}?favorites=${favoritesParam}`;
		return publicUrl;
	};

	/**
	 * Handles the click event on the "Generate Public URL" button to update the public URL state
	 */
	const handleGeneratePublicURL = () => {
		const publicUrl = generatePublicURL();
		setPublicUrl(publicUrl);
		setPublicUrlOpen(true);
	};

	if (loading) {
		<Loading />;
	}
	<Authentication />;

	const showsToRender = filteredShows.length > 0 ? filteredShows : shows;

	const toggleDescription = (index) => {
		setShowEpisodesDescription(
			showEpisodesDescription === index ? false : index,
		);
	};

	const handleSortSubmit = (event) => {
		event.preventDefault();

		const sortBy = event.target.value;
		handleSubmit(event, sortBy);
	};

	const toggleMinimized = () => {
		setIsMinimized(!isMinimized);
	};

	return (
		<>
			<button
				className="btn btn-secondary  fav-btn"
				onClick={handleGeneratePublicURL}
			>
				Favorites URL
			</button>
			{publicUrlOpen && publicUrl && (
				<div className="modal-body bg-light url-div">
					<a href="#" onClick={openFavoriteShowsModal}>
						<strong>Favorites_Link</strong>
					</a>
					<button
						className="btn btn-danger  close"
						onClick={() => setPublicUrlOpen(false)}
					>
						close
					</button>
				</div>
			)}

			<FavoriteEpisodes
				favoriteEpisodes={favoriteEpisodes}
				setFavoriteEpisodes={setFavoriteEpisodes}
				episodes={episodes}
				checked={
					favCheckboxes[
						`favCheck-${episodes.map((episode) => episode.index)}`
					] || false
				}
				id={`favCheck-${episodes.map((episode) => episode.index)}`}
				handleCheckboxChange={handleCheckboxChange}
			/>
			<div className="container-fluid">
				<nav className="navbar navbar-light bg-light navbar-expand-lg py-3 ">
					<div className="container-fluid">
						<a className="navbar-brand">
							<img
								src={logo}
								alt="podcast logo"
								className="navbar-logo-image"
							/>
						</a>
						<form className="d-flex" onSubmit={handleSubmit}>
							<input
								className="form-control me-2"
								type="search"
								placeholder="Search"
								aria-label="Search"
								name="search"
								value={searchValue}
								onChange={handleInputChange}
							/>
							<select
								className="form-select me-2"
								aria-label="Select Genre"
								name="genre"
								value={selectedGenre}
								onChange={handleInputChange}
							>
								<option value="">All Genres</option>
								{genres.map((genre) => (
									<option
										key={genre.code}
										value={genre.code}
										style={{ color: "blue" }}
									>
										{genre.name}
									</option>
								))}
							</select>
							<select
								onChange={handleSortSubmit}
								className="sort"
								style={{ color: "blue" }}
							>
								<option value="">Sort by :</option>
								<option value="titleAsc">Title (A-Z)</option>
								<option value="titleDesc">Title (Z-A)</option>
								<option value="dateAsc">Date Updated (Ascending)</option>
								<option value="dateDesc">Date Updated (Descending)</option>
							</select>
							<button
								className="search-btn btn btn-outline-success"
								type="submit"
							>
								Genre
							</button>
						</form>
						<button
							className=" favorites-btn btn btn-primary"
							onClick={openFavoriteShowsModal}
						>
							View Favorite Shows
						</button>
					</div>
				</nav>
			</div>
			{/** Main Content */}
			<div className="app">
				<div className="container">
					<div className="row ">
						<div className="carousel-wrapper" style={{ marginBottom: "50px" }}>
							<Slider {...carouselSettings}>
								{shows.map((show) => (
									<div className={`col-md-3 mb-4`} key={show.id}>
										<img
											src={show.image}
											alt={show.id}
											style={{ width: "90px", height: "70px" }}
										/>
										<h4>{show.title}</h4>
										<h6>Seasons : {show.seasons}</h6>
										<h6 className="card-subtitle mb-2">
											Genre(s): {getGenreName(show.genres)}
										</h6>
										<div
											className={`card h-100 ${
												favoriteShows.includes(show.id) ? "favorite" : ""
											}`}
											style={{ maxWidth: "18rem" }}
										></div>
									</div>
								))}
							</Slider>
						</div>
						{showsToRender.map((show) => (
							<div className="col-md-3 mb-4" key={show.id}>
								<div
									className={`card h-100 ${
										favoriteShows.includes(show.id) ? "favorite" : ""
									}`}
									style={{ maxWidth: "18rem" }}
								>
									<img
										className="card-img-top"
										src={show.image}
										alt={show.title}
										onClick={() => handleShowClick(show.id)}
									/>
									<div className="card-body d-flex flex-column">
										<h2 className="card-title fw-bold">{show.title}</h2>
										<h4 className="card-subtitle mb-2">
											Genre(s): {getGenreName(show.genres)}
										</h4>
										<p className="card-text flex-grow-1">
											<strong>Description -</strong>
											{show.showFullDescription
												? show.description
												: `${show.description.slice(0, 70)}...`}
										</p>
										{show.description.length > 70 && (
											<button
												className={
													show.showFullDescription
														? "btn btn-success"
														: "btn btn-primary"
												}
												onClick={() => toggleShowMore(show.id)}
											>
												{show.showFullDescription
													? "Show Less"
													: "Show Full Description"}
											</button>
										)}
										<h4>Seasons :{show.seasons}</h4>
										<p className="card-text">
											<strong>Updated: </strong>
											{new Date(show.updated).getFullYear()} /
											{String(new Date(show.updated).getMonth() + 1).padStart(
												2,
												"0",
											)}{" "}
											/
											{String(new Date(show.updated).getDate()).padStart(
												2,
												"0",
											)}
										</p>
										<div className="form-check">
											<input
												type="checkbox"
												className="form-check-input bg-primary"
												checked={favoriteShows.includes(show.id)}
												onChange={() => handleToggleFavorite(show.id)}
											/>
											{favoriteShows.includes(show.id) && (
												<label className="form-check-label">
													<strong>Time: {favoriteShowsTime[show.id]}</strong>
													<br />
													<strong>
														Date:{" "}
														{`${new Date().getDate()} / ${
															new Date().getMonth() + 1
														} / ${new Date().getFullYear()}`}
													</strong>
												</label>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				{/** Episodes Dialog */}
				{episodes.length > 0 && dialogOpen && (
					<div
						className={`modal ${isMinimized ? "minimized" : ""}`}
						style={{ display: "block" }}
					>
						<div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-md ">
							<div className="modal-content">
								<div className="modal-header bg-primary text-white">
									<h5 className="modal-title">
										{seasons.length} Seasons & {episodes.length} Episodes
									</h5>
									<button
										className="btn-close"
										onClick={closeDialog}
										aria-label="Close"
									></button>
									<button
										onClick={resetProgress}
										className="btn btn-danger btn-reset"
									>
										Reset
									</button>
									<button
										className="btn btn-dark btn-minimize"
										onClick={toggleMinimized}
									>
										{isMinimized ? "Maximize" : "Minimize"}
									</button>
								</div>
								<div className="modal-body bg-white p-4">
									<img src={images} alt={images} />
									{episodes.map((eps, index) => (
										<div key={index} className="episode mb-4 bg-light">
											<h4>
												<strong>Season {eps.season}</strong> - Episode{" "}
												{eps.episode}
											</h4>
											<h5>
												<strong>Title :</strong> {eps.title}
											</h5>
											{showEpisodesDescription === index && (
												<p>{eps.description}</p>
											)}
											<button
												className={
													showEpisodesDescription === index
														? "btn btn-info mt-0"
														: "btn btn-primary mt-0"
												}
												onClick={() => toggleDescription(index)}
											>
												{showEpisodesDescription === index
													? "Hide Description"
													: "Show Description"}
											</button>
											<audio
												id={`audio-player-${index}`}
												className="audio-player"
												controls
												onPause={handleAudioSelection}
											>
												<source src={eps.file} type="audio/mpeg" />
												This browser does not support HTML 5 audio
											</audio>
											<CheckboxItem
												id={`favCheck-${index}`}
												label="Favorite"
												checked={favCheckboxes[`favCheck-${index}`] || false}
												onChange={handleCheckboxChange(`favCheck-${index}`)}
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			{favoriteShowsModalOpen && (
				<div className="modal" style={{ display: "block" }}>
					<div className="modal-dialog modal-dialog-centered modal-md my-modals">
						<div className="modal-content">
							<div className="modal-header bg-primary text-white">
								<h5 className="modal-title">Favorite Shows</h5>
								<button
									className="btn-close"
									onClick={openFavoriteShowsModal}
									aria-label="Close"
								></button>
							</div>
							<div key={generateUUID()} className="modal-body bg-white p-4">
								<div className="form-check mb-3">
									<input
										type="radio"
										className="form-check-input"
										id="sortAsc"
										value="titleAsc"
										checked={sortOrder === "titleAsc"}
										onChange={handleSortOrderChange}
									/>
									<label className="form-check-label" htmlFor="titleAsc">
										<strong>
											Sort by Title (A to Z){" "}
											<span style={{ color: "blue" }}>- Default</span>
										</strong>
									</label>
								</div>
								<div className="form-check mb-3">
									<input
										type="radio"
										className="form-check-input"
										id="titleDesc"
										value="titleDesc"
										checked={sortOrder === "titleDesc"}
										onChange={handleSortOrderChange}
									/>
									<label className="form-check-label" htmlFor="titleDesc">
										<strong>Sort by Title (Z to A)</strong>
									</label>
								</div>
								<div className="form-check mb-3">
									<input
										type="radio"
										className="form-check-input"
										id="sortDateAsc"
										value="dateAsc"
										checked={sortOrder === "dateAsc"}
										onChange={handleSortOrderChange}
									/>
									<label className="form-check-label" htmlFor="sortDateAsc">
										<strong>Sort by Updated Date (Ascending) </strong>
									</label>
								</div>
								<div className="form-check mb-3">
									<input
										type="radio"
										className="form-check-input"
										id="sortDateDesc"
										value="dateDesc"
										checked={sortOrder === "dateDesc"}
										onChange={handleSortOrderChange}
									/>
									<label className="form-check-label" htmlFor="sortDateDesc">
										<strong>Sort by Updated Date (Descending)</strong>
									</label>
								</div>
								{/* Use the sortFavoriteShows function to sort by selected option */}
								{sortFavoriteShows(favoriteShows, shows, sortOrder).map(
									(show) => (
										<div key={show?.id} className="favorite-show">
											{/**  optional chaining (?.) */}
											{show?.image && (
												<img
													src={show.image}
													alt={show.id}
													style={{ width: "60px", height: "50px" }}
												/>
											)}
											{show ? (
												<>
													<h4>{show.title}</h4>
													<h5>Seasons: {show.seasons}</h5>
													<h6>Genre(s): {getGenreName(show.genres)}</h6>
													<p>
														Updated:{" "}
														{new Date(show.updated).toLocaleDateString()}
													</p>
													<hr />
												</>
											) : (
												<p></p>
											)}
										</div>
									),
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			<Feedback />
		</>
	);
}
MainContent.propTypes = {
	shows: PropTypes.array.isRequired,
	setShows: PropTypes.func.isRequired,
	favoriteShows: PropTypes.array.isRequired,
	setFavoriteShows: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	setIsAuthenticated: PropTypes.func.isRequired,
	selectedGenre: PropTypes.string.isRequired,
	setSelectedGenre: PropTypes.func.isRequired,
	seasons: PropTypes.array.isRequired,
	setSeasons: PropTypes.func.isRequired,
	episodes: PropTypes.array.isRequired,
	setEpisodes: PropTypes.func.isRequired,
	filteredShows: PropTypes.array.isRequired,
	setFilteredShows: PropTypes.func.isRequired,
};
