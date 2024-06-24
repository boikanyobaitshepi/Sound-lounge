import { useState } from "react";
import "./CSS/App.css";

/**
 * Renders the UserInstructions component, which provides instructions for using the MainContent component.
 *
 * @returns {JSX.Element} The rendered UserInstructions component.
 */
export const UserInstructions = () => {
	const [isOpen, setIsOpen] = useState(false);

	/**
	 * Toggles the visibility of the instructions dialog.
	 */
	const toggleDialog = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="container mt-5">
			<button className="btn btn-primary" onClick={toggleDialog}>
				<strong>User Instructions</strong>
			</button>
			{isOpen && (
				<div className="modal show" style={{ display: "block" }}>
					<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable text-white">
						<div className="modal-content bg-dark">
							<div className="modal-header">
								<h5 className="modal-title">User Instructions</h5>
								<button
									type="button"
									className="btn-close"
									onClick={toggleDialog}
								></button>
							</div>
							<div className="modal-body">
								<ol>
									<li>
										Firstly <strong>SIGN UP OR SIGN-IN</strong> before accessing
										the podcast
									</li>
									<hr />
									<li>
										Enter your search criteria in the search input field. You
										can search by show title.
									</li>
									<hr />
									<li>
										Optionally, select a genre from the dropdown to filter the
										shows by genre.
									</li>
									<hr />
									<li>
										Click the <strong>Genre button</strong> to filter the shows
										based on the selected genre.
									</li>
									<hr />
									<li>
										The filtered shows will be displayed as cards in the main
										content area.
									</li>
									<hr />
									<li>
										Click on a show <strong>image</strong> to view its episodes.
									</li>
									<hr />
									<li>
										Open a show so it appears on{" "}
										<strong>Mark Favorite Episodes</strong> then the user will
										be able to mark their favorite Episodes when they click{" "}
										<strong>Mark Favorite Episodes button</strong>
									</li>
									<hr />
									<li>
										The episodes dialog will open, showing all the seasons and
										episodes for the selected show.
									</li>
									<hr />
									<li>
										Click on <strong>Show Full Description</strong> to view the
										episode description.
									</li>
									<hr />
									<li>Click on the play button to listen to the episode.</li>
									<hr />
									<li>
										Toggle the favorite status of a show by clicking on the
										check box on the bottom left corner of the previews/shows.
									</li>
									<hr />
									<li>Scroll down to find the feedback form.</li>
									<hr />
									<li>
										The User can also sort the shows / previews in{" "}
										<strong>alphabetical order</strong> either from{" "}
										<strong>[A to Z] or [Z to A]</strong>
									</li>
									<hr />
									<li>
										The shows can be sorted also by the{" "}
										<strong>first letter</strong> of their title either from{" "}
										<strong>[A to Z] or [Z to A]</strong>
									</li>
									<hr />
									<li>
										Shows can also be sorted by <strong>Updated Date</strong> by
										either the earliest or latest date
									</li>
									<hr />
									<li>Enter your feedback in the text area.</li>
									<hr />
									<li>
										Users can also <strong>minimize</strong> the episode modal
										to browse the App while listening to their favorite episode
									</li>
									<hr />
									<li>
										<strong>Sort by :</strong> is the default which will sort
										the shows the way they are in the fetched data
									</li>
									<hr />
									<li>
										Click the <strong>Submit Feedback</strong> button to submit
										your feedback.
									</li>
									<hr />
									<li>
										A success message will be displayed after submitting the
										feedback.
									</li>
									<hr />
								</ol>
							</div>
							<div className="modal-footer">
								<button className="btn btn-danger" onClick={toggleDialog}>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserInstructions;
