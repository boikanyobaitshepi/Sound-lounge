/**
 * Carousel settings for the sliding carousel of possible shows.
 *
 * @typedef {Object} CarouselSettings
 * @property {boolean} dots - Whether to display dots navigation for the carousel.
 * @property {boolean} infinite - Whether to loop the carousel infinitely.
 * @property {number} speed - The transition duration in milliseconds for the carousel slides.
 *                            Increase this value for a slower carousel.
 * @property {number} slidesToShow - The number of slides to show at once in the carousel.
 * @property {number} slidesToScroll - The number of slides to scroll per single carousel slide transition.
 * @property {boolean} autoplay - Whether to enable autoplay for the carousel.
 * @property {number} autoplaySpeed - The duration in milliseconds between carousel slide transitions in autoplay mode.
 */

/**
 * Settings for the sliding carousel of possible shows.
 *
 * @type {CarouselSettings}
 */
export const carouselSettings = {
	dots: true,
	infinite: true,
	speed: 4500,
	slidesToShow: 4,
	slidesToScroll: 4,
	autoplay: true,
	autoplaySpeed: 10000,
};
