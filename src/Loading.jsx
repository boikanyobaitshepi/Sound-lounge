/**
 * Loading Component
 *
 * A React functional component that renders a loading spinner.
 *
 * @returns {JSX.Element} JSX representation of the Loading component.
 */
export const Loading = () => {
	return (
		<div className="spinner-container text-primary">
			<div className="spinner-border" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	);
};
