import { useState, useEffect } from "react";
import CheckboxItem from "./checkbox";
import PropTypes from "prop-types";
import {
	saveToLocalStorage,
	getFromLocalStorage,
} from "./localStorage/locaLStorage";
import { supabase } from "./supabase";

/**
 * A React component that displays a button to view favorite episodes and a modal to show the favorite episodes list.
 * It also supports saving and retrieving the list of favorite episodes in/from local storage.
 *
 * @component
 * @param {Object} props - The properties for the FavoriteEpisodes component.
 * @param {Array} props.episodes - An array of favorite episodes to be displayed in the modal.
 * @param {Function} props.handleCheckboxChange - A function to handle checkbox state changes.
 * @param {any} props.id - An identifier used for the CheckboxItem component.
 * @returns {JSX.Element} The FavoriteEpisodes component JSX element.
 */
export default function FavoriteEpisodes(props) {
	const { episodes, handleCheckboxChange, id } = props;
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		// Load data from local storage when the component is mounted
		const savedEpisodes = getFromLocalStorage("favoriteEpisodes");
		if (savedEpisodes) {
			handleCheckboxChange(savedEpisodes);
		}
	}, [handleCheckboxChange]);

	/**
	 * Opens the modal to display the favorite episodes list.
	 * @function
	 * @inner
	 */
	const openModal = () => {
		setModalOpen(true);
	};

	/**
	 * Closes the modal.
	 * @function
	 * @inner
	 */
	const closeModal = () => {
		setModalOpen(false);
	};

	/**
	 * Handles the change of a checkbox for an episode.
	 * Updates the state of the episode and saves the changes to local storage and Supabase.
	 * @function
	 * @inner
	 * @param {number} index - The index of the episode in the episodes array.
	 * @returns {void}
	 */
	const handleEpisodeCheckboxChange = (index) => async (event) => {
		const updatedEpisodes = [...episodes];
		updatedEpisodes[index].checked = event.target.checked;
		handleCheckboxChange(updatedEpisodes);

		// Extract the titles of checked episodes
		const checkedTitles = updatedEpisodes
			.filter((episode) => episode.checked)
			.map((episode) => episode.title);

		// Save data to local storage when checkboxes are toggled
		saveToLocalStorage("favoriteEpisodes", updatedEpisodes);

		// Save checked episodes titles to Supabase
		try {
			const { error } = await supabase
				.from("The Audio Lounge")
				.insert({ favorite_episodes: checkedTitles })
				.select("showId", id);

			if (error) {
				throw new Error(error.message);
			}
		} catch (error) {
			console.error(error.message);
		}
	};

	const initializedEpisodes = episodes.map((episode) => ({
		...episode,
		checked: false,
	}));

	return (
		<>
			<button
				className="btn btn-primary episodes-modal-btn"
				onClick={openModal}
			>
				Mark Favorite Episodes
			</button>
			{initializedEpisodes && modalOpen && (
				<div className="modal" style={{ display: "block" }}>
					<div className="modal-dialog modal-dialog-centered modal-md">
						<div className="modal-content">
							<div className="modal-header bg-primary text-white">
								<h5 className="modal-title">Favorite Episodes</h5>
								<button
									className="btn-close"
									onClick={closeModal}
									aria-label="Close"
								></button>
							</div>
							<div className="modal-body bg-white p-4">
								{episodes.length === 0 ? (
									<h3>There are no favorite episodes selected</h3>
								) : (
									episodes.map((episode, index) => (
										<div
											key={index}
											className={`favorite-episode ${
												!episode.checked ? "blur" : ""
											}`}
											style={!episode.checked ? { opacity: 0.5 } : {}}
										>
											<h4>
												<strong>Season {episode.season}</strong> - Episode{" "}
												{episode.episode}
											</h4>
											<h5>
												<strong>Title:</strong> {episode.title}
											</h5>
											<p>{episode.description}</p>
											<audio controls>
												<source src={episode.file} type="audio/mpeg" />
											</audio>
											<CheckboxItem
												id={id}
												label="Favorite Episode"
												checked={episode.checked}
												onChange={handleEpisodeCheckboxChange(index)}
											/>
											<hr />
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

FavoriteEpisodes.propTypes = {
	episodes: PropTypes.array,
	handleCheckboxChange: PropTypes.func,
	id: PropTypes.any,
};
