import React from 'react';
import {connect} from 'react-redux';
import { updateQuery, submitQuery } from '../../actions';
import SavedQuerySelector from './SavedQuerySelector';

class QueryBar extends React.Component {

	constructor(props) {
		super(props);
		this.handleEntry = this.handleEntry.bind(this);
	}

	handleEntry(e) {
		if(e.keyCode === 13) {
			e.preventDefault();
			this.props.submitQuery(				
				this.props.query
			);
		}
		else {
			this.props.updateQuery(e.target.value);
		}
	}


	render() {
		return (
			<div>
				<div className="saved-queries">
					<SavedQuerySelector />
				</div>
				<div className="query-input" style={{width: this.props.width-250}}>
					<input onChange={this.handleEntry} onKeyUp={this.handleEntry} value={this.props.query} />
				</div>
			</div>
		);
	}
}

export default connect(
	state => ({
		query: state.main.query,
		width: state.main.viewportWidth
	}),

	dispatch => ({
		updateQuery(value) {
			dispatch(updateQuery(value));
		},

		submitQuery(query, params = {}) {
			dispatch(submitQuery(query, params));
		}
		
	})
)(QueryBar);