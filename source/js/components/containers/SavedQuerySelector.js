import React from 'react';
import { connect } from 'react-redux';
import { 
	getQueries, 	
	runSavedQuery, 
	selectSavedQuery,
	updateSavedQuery,
	destroyQuery
} from '../../actions';

class SavedQuerySelector extends React.Component {

	constructor(props) {
		super(props);
		this.doUpdate = this.doUpdate.bind(this);
		this.doDestroy = this.doDestroy.bind(this);
	}

	doUpdate(e) {
		e.preventDefault();
		this.props.update(this.props.selected);
	}

	doDestroy(e) {
		e.preventDefault();
		this.props.destroy(this.props.selected);
	}

	componentDidMount() {
		this.props.load();
	}

	render () {
		const { select, options, selected } = this.props;
		
		if(!options.length) return null;

		return (
			<div>
				<strong>Saved queries ({options.length})</strong>&nbsp;
				<select onChange={select} value={selected}>
					<option>-- select --</option>
					{options.map(o => (
						<option key={o.id} value={o.id}>{o.title}</option>
					))}
				</select>
				{selected &&
					<span>&nbsp;
							<button onClick={this.doUpdate}>update query to current view</button>
							<button onClick={this.doDestroy}>delete this query</button>						
					</span>
				}
			</div>
		);
	}
}

export default connect(
	state => ({
		options: state.main.savedQueries,
		selected: state.main.selectedSavedQueryID
	}),

	dispatch => ({
		load() {
			dispatch(getQueries());
		},

		select(e) {
			const v = e.target.value;
			dispatch(selectSavedQuery(v));
			if(v) {
				dispatch(runSavedQuery(v));
			}
		},

		update(id) {			
			dispatch(updateSavedQuery(id));
		},

		destroy(id) {
			if(window.confirm('Are you sure you want to delete this saved query?')) {
				dispatch(destroyQuery(id))
			}
		}
	})
)(SavedQuerySelector);