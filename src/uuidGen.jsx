/**
 * Generate a random UUID (Version 4)
 *
 * @returns {string} A randomly generated UUID.
 */
export default function generateUUID() {
	const hexDigits = "0123456789abcdef";
	const segments = [8, 4, 4, 4, 12];

	let uuid = "";
	segments.forEach((segmentLength, segmentIndex) => {
		for (let i = 0; i < segmentLength; i++) {
			uuid += hexDigits[Math.floor(Math.random() * 16)];
		}
		if (segmentIndex < segments.length - 1) {
			uuid += "-";
		}
	});

	return uuid;
}
