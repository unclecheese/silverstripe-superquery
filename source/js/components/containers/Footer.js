import React from 'react';
import { connect } from 'react-redux';
import { saveQuery, toggleColumnWindow, destroyQuery, updateSavedQuery } from '../../actions';
import Pagination from './Pagination';
import ExportButtons from './ExportButtons';

class Footer extends React.Component {

	render() {
		const { width, toggleColumnWindow, save, size, selctedQuery } = this.props;
		return (
		  <div className="table-footer" style={{width: width-252, height: 50}}>
		  	<Pagination />
			<ExportButtons />

		  	<span className="button-group">
				<a onClick={toggleColumnWindow}>Columns...</a>
			</span>
		  	<span className="button-group">
				<a onClick={save}>Save...</a>		
		  	</span>


			<div className="result-info">
				{size} total results
			</div>
		  </div>
		);
	}
}

export default connect(
	state => ({
		width: state.main.viewportWidth,
		size: state.main.size,
		selectedQuery: state.main.selectedSavedQueryID
	}),

	dispatch => ({
		save(e) {
			e.preventDefault();
			const title = window.prompt('Enter a name for this query');
			dispatch(saveQuery(title));
		},

		toggleColumnWindow(e) {
			e.preventDefault();
			dispatch(toggleColumnWindow());
		}
	})
)(Footer);