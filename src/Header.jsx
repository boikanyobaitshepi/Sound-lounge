import "bootstrap/dist/css/bootstrap.css";
import logo from "./favicons/radio-outline.svg";
import "./CSS/App.css";
import UserInstructions from "./Instructions";
import Socials from "./socials";

/**
 * Renders the header component for podcast.
 *
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
	return (
		<>
			<h1 className="display-1">
				<img src={logo} alt="podcast logo" className="image" />
				The Audio Lounge
			</h1>
			<div className="heading">
				<UserInstructions />
				<Socials />
			</div>
		</>
	);
}
