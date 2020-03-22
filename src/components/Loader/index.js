import React from 'react';
import './styles.css';

const Loader = () => {
	const chance = Math.random() < 0.5;

	return (
		<div class="loader">
			<div class={`loader__item ${chance ? 'loader_sparkles' : 'loader_sparkles_shuffled'}`} />
			<div class={`loader__item ${chance ? 'loader_rainbows' : 'loader_rainbows_shuffled'}`} />
		</div>
	);
}

export default Loader;
