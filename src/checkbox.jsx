import PropTypes from "prop-types";

/**
 *
 * A reusable checkbox component that allows users to toggle a checkbox on or off.
 *
 * @param {object} props - The props object containing the following properties:
 * @param {string} props.id -The unique ID for the checkbox input element.
 * @param {string} props.label -The label to display alongside the checkbox.
 * @param {boolean} props.checked -  Specifies whether the checkbox is checked or not.
 * @param {Function}  props.onChange - The event handler function to be called when the checkbox value changes.
 *
 * @returns {JSX.Element} -A div element containing an input checkbox and a label.
 *
 */
export const CheckboxItem = ({ id, label, checked, onChange }) => (
	<div>
		<input
			type="checkbox"
			id={id}
			name="favCheck"
			checked={checked}
			onChange={onChange}
		/>
		<label htmlFor={id}>{label}</label>
	</div>
);

CheckboxItem.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};

export default CheckboxItem;
