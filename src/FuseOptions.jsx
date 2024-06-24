/**
 * Configuration options for Fuse.js fuzzy search.
 * Use this constant to customize the behavior of the fuzzy search algorithm.
 *
 * @constant {FuseOptions} fuseOptions
 * @property {string[]} keys - The fields to perform fuzzy search on.
 * @property {number} threshold - The minimum score needed to consider a match (0 to 1).
 * @property {number} distance - The maximum distance between the search query and a match.
 */
export const fuseOptions = {
	keys: ["title"],
	threshold: 0.2,
	distance: 50,
};
