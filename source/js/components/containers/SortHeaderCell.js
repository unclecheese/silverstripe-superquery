import React from 'react';
import {connect} from 'react-redux';
import {Cell} from 'fixed-data-table';
import {sortColumn} from '../../actions';

class SortHeaderCell extends React.Component {

	constructor(props) {
		super(props);
		this.handleSort = this.handleSort.bind(this);
	}

	handleSort(e) {
		console.log('wtf');
		e.preventDefault();
		this.props.onSort(
			this.props.columnKey,
			this.props.sortDir ? this.props.sortDir*-1 : 1
		);
	}

	render () {
		const {sortDir, onSort, children} = this.props;
		const label = sortDir === 1 ? 'asc' : (sortDir === -1 ? 'desc' : '');

		return (
			<Cell
				className={`header-cell ${label}`}
				onClick={this.handleSort}
			>
				{children}
				{label && <i className={`fa fa-sort-${label}`} />}				
			</Cell>
		);

	}
}

SortHeaderCell.propTypes = {
	columnKey: React.PropTypes.any.isRequired,
	sortDir: React.PropTypes.any,
	onSort: React.PropTypes.func
}

export default connect(
	(state, ownProps) => ({
		sortDir: state.main.sortCol === ownProps.columnKey ? state.main.sortDir : null
	}),
	dispatch => ({
		onSort(column, dir) {
			dispatch(sortColumn({column, dir}))
		}
	})
)(SortHeaderCell);