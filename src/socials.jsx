import facebook from "./socials/logo-facebook.svg";
import github from "./socials/logo-github.svg";
import Twitter from "./socials/logo-twitter (1).svg";
import linkedIn from "./socials/logo-linkedin.svg";
import email from "./socials/mail-outline.svg";

/**
 * Socials component that render a list of social media links with corresponding icons.
 *
 * @returns {JSX.Element} -JSX element representing the Socials component
 */
export default function Socials() {
	return (
		<ul className="socials navbar-nav ms-auto">
			<li className="nav-item">
				<a
					className="nav-link"
					href="https://twitter.com/MalgasZakes1?t=LINT0NfCtgGXUkkGEVQV_g&s=09"
				>
					<i className="fab fa-twitter">
						<img src={Twitter} alt={Twitter} className="nav-image" />
					</i>
				</a>
			</li>
			<li className="nav-item">
				<a className="nav-link" href="https://www.facebook.com/nelson.zakes.7">
					<i className="fab fa-facebook">
						<img src={facebook} alt={facebook} className="nav-image" />
					</i>
				</a>
			</li>
			<li className="nav-item">
				<a
					className="nav-link"
					href="https://www.linkedin.com/in/nelson-zongezile-malgas-58b194b2/"
				>
					<i className="fab fa-linkedin">
						<img src={linkedIn} alt={linkedIn} className="nav-image" />
					</i>
				</a>
			</li>
			<li className="nav-item">
				<a className="nav-link" href="https://github.com/NelsonMALGAS">
					<i className="fab fa-github">
						<img src={github} alt={github} className="nav-image" />
					</i>
				</a>
			</li>
			<li className="nav-item">
				<a className="nav-link" href="mailto:zmalgas69@gmail.com">
					<i className="fas fa-envelope">
						<img src={email} alt={email} className="nav-image" />
					</i>
				</a>
			</li>
		</ul>
	);
}
