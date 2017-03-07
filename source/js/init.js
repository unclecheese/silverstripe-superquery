/*eslint-disable */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/pages/App';
import store from './store';

jQuery('#superquery-app').entwine({
	onmatch () {
		render(
			<Provider store={store}>
				<App />
			</Provider>,
			this[0]
		)
	},

	onunmatch () {
		unmountComponentAtNode(this[0])
	}
});

jQuery('.cms .SuperQueryAdmin form#Form_EditForm').entwine({

	onsubmit (e) {
		e.preventDefault();
	}
});

window.addEventListener('resize', () => store.dispatch({
	type: 'UPDATE_VIEWPORT',
	payload: {
		width: window.innerWidth,
		height: window.innerHeight
	}
}));