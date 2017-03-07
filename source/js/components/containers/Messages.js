import React from 'react';
import {connect} from 'react-redux';
import Bounce from '../ui/loaders/Bounce';

const Messages = ({
	loading,
	error,
	initialised,
	data
}) => {
	console.log(error);
	return (
	<div className="message-container">
		{loading && <Bounce />}
		{error && 
			<div className="error-message">
				<h3>Well, that didn't work.</h3>
				<p>{error.substring(0, 70)}
				{error.length > 70 &&
					<a href="#" onClick={(e) => {e.preventDefault(); alert(error);}}>Show full error</a>
				}
				</p>				
			</div>
		}
		{initialised && data && data.length === 0 &&
			<div className="warning-message">
				<h3>No results</h3>
			</div>
		}
	</div>
	);
}

export default connect(
	state => ({
		loading: state.main.loading,
		error: state.main.errorMsg,
		initialised: state.main.initialised,
		data: state.main.data
	})
)(Messages)