import { useState, useEffect } from "react";
import {
	saveToLocalStorage,
	getFromLocalStorage,
} from "./localStorage/locaLStorage";
import { supabase } from "./supabase";
import PropTypes from "prop-types";

/**
 * A component for handling user authentication (Sign In and Sign Up).
 *
 * @param {Object} props - The component's props.
 * @param {Function} props.onSignIn - A callback function called when the user successfully signs in.
 * @returns {JSX.Element} - JSX Element representing the Authentication component.
 */
export const Authentication = (props) => {
	const { onSignIn } = props;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [validationError, setValidationError] = useState("");
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Fetch the saved users from the local storage on component mount.
	 */
	useEffect(() => {
		const savedUsers = getFromLocalStorage("users");
		if (savedUsers) setUsers(savedUsers);
	}, []);

	/**
	 * Handles the form submission for user authentication.
	 *
	 * @param {Event} e - The form submission event object.
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isSignUp) {
			// Check if the email is already registered
			const userExists = users.some((user) => user.email === email);
			if (userExists) {
				setValidationError("Email is already registered");
			} else if (isSignUp) {
				try {
					setIsLoading(true);
					// Use Supabase to sign up the user
					const { error } = await supabase.auth.signUp({ email, password });

					setIsLoading(false);

					if ((users, error)) {
						setValidationError("Error signing up: " + error.message);
					} else {
						onSignIn();
					}
				} catch (error) {
					setIsLoading(false);
					console.error("Error signing up:", error.message);
				}
			}

			// Additional checks for sign-up
			if (!email || !password) {
				setValidationError("Please fill in all the required fields");
				return;
			}

			// Add the new user to the array
			const newUser = { email, password };
			const updatedUsers = [...users, newUser];
			setUsers(updatedUsers);

			try {
				// Use the Supabase query to insert data into "The Audio Lounge" table
				const { data, error } = await supabase
					.from("The Audio Lounge")
					.insert([{ email: newUser.email, password: newUser.password }])
					.select();

				if (error) {
					throw new Error("Error saving data to database:", error.message);
				} else {
					data;
				}
			} catch (error) {
				console.error("Error saving data to database:", error.message);
			}

			saveToLocalStorage("users", updatedUsers);

			if (email && password && isSignUp) {
				onSignIn();
			}
		} else {
			const user = users.find(
				(user) => user.email === email && user.password === password,
			);

			if (user) {
				onSignIn();
			} else {
				setValidationError("Invalid email or password");
			}
		}
	};

	return (
		<div className="container auth-container">
			<h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
			{validationError && <p className="text-danger">{validationError}</p>}
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email address
					</label>
					<input
						type="email"
						className="form-control"
						id="email"
						value={email}
						placeholder="example@gmail.com"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<input
						type="password"
						className="form-control"
						id="password"
						value={password}
						placeholder="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className="mb-3 form-check">
					<input
						type="checkbox"
						className="form-check-input"
						id="signup"
						checked={isSignUp}
						onChange={() => setIsSignUp(!isSignUp)}
					/>
					<label className="form-check-label" htmlFor="signup">
						Sign Up
					</label>
				</div>
				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					{isLoading ? (
						<span
							className="spinner-border spinner-border-sm"
							role="status"
							aria-hidden="true"
						></span>
					) : isSignUp ? (
						"Sign Up"
					) : (
						"Sign In"
					)}
				</button>
			</form>
		</div>
	);
};

/**
 * PropTypes validation for the Authentication component.
 *
 * @static
 * @type {object}
 * @property {Function} onSignIn - A callback function called when the user successfully signs in.
 *
 */
Authentication.propTypes = {
	onSignIn: PropTypes.func,
};

export default Authentication;
