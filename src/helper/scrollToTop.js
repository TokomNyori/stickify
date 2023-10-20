const scrollToTop = () => {
    const duration = 1000; // Adjust the duration of the scroll animation
    const startTime = performance.now();
    const startPosition = window.pageYOffset;

    const easingFunction = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunction(progress);
        const newPosition = startPosition + (0 - startPosition) * easedProgress;

        window.scrollTo(0, newPosition);

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    };

    requestAnimationFrame(animateScroll);
};

export default scrollToTop