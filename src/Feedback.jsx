import { useState } from "react";
import { saveToLocalStorage } from "./localStorage/locaLStorage";
import "./CSS/App.css";

/**
 * Handles the form submission of the feedback
 *
 * @param {object} event - The form submission event object
 */
export default function Feedback() {
	const [feedback, setFeedback] = useState("");
	const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

	const handleFeedbackSubmit = (event) => {
		event.preventDefault();
		// Submit the feedback
		setFeedbackSubmitted(true);
		saveToLocalStorage("feedback", feedback);
	};

	return (
		<div className="container  mt-5 feedback">
			<strong>
				<h2>Feedback Form</h2>
			</strong>
			{!feedbackSubmitted ? (
				<form onSubmit={handleFeedbackSubmit}>
					<div className="mb-3">
						<label htmlFor="feedbackTextarea" className="form-label">
							Your Feedback
						</label>
						<textarea
							className="form-control"
							id="feedbackTextarea"
							rows="3"
							value={feedback}
							onChange={(e) => setFeedback(e.target.value)}
						></textarea>
					</div>
					<button type="submit" className="btn btn-primary">
						Submit Feedback
					</button>
				</form>
			) : (
				<div className="alert alert-success mt-3" role="alert">
					Thank you for your feedback!
				</div>
			)}
		</div>
	);
}
