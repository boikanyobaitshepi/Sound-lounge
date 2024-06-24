/**
 * The local storage where the App saves the data in
 *
 * @param {String} key -The key under which the data will be stored
 * @param {any} data -The data to be stored in the local storage
 * @returns {void}
 */
export const saveToLocalStorage = (key, data) => {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error("Error saving to local storage:", error);
	}
};

/**
 * Retrieves data from the local storage
 *
 * @param {string} key - The key of the data to retrieve from the local storage
 * @returns {any} -The retrieved data from the local storage or null if not found
 */
export const getFromLocalStorage = (key) => {
	try {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error("Error retrieving from local storage:", error);
		return null;
	}
};

/**
 * Removes data from the local storage
 *
 * @param {string} key - The key of the data to remove from the local storage
 * @returns {void}
 */
export const removeFromLocalStorage = (key) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error("Error removing data from local storage:", error);
	}
};
