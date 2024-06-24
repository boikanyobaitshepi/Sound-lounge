import { removeFromLocalStorage } from "./localStorage/locaLStorage";

/**
 * Resets the progress of the episodes
 */
export const resetProgress = () => {
	for (const key in localStorage) {
		if (
			key.startsWith("currentTime-") ||
			key.startsWith("progressPercentage-") ||
			key.startsWith("fullyListened-")
		) {
			removeFromLocalStorage(key);
		}
	}
	removeFromLocalStorage("currentTime-");
	removeFromLocalStorage("progressPercentage");
};
