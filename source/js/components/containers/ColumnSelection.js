import React from 'react';
import { connect } from 'react-redux';
import Checkboxes from '../ui/SimpleCheckboxList';
import { selectColumns } from '../../actions';

class ColumnSelection extends React.Component {

	componentDidMount () {
		if(!this.props.savedQuery) {
			this.props.selectColumns(this.props.options);
		}
	}

	componentWillReceiveProps (nextProps) {
		if(!nextProps.savedQuery) {
			if(nextProps.dataClass !== this.props.dataClass) {		
				this.props.selectColumns(nextProps.options);
			}
		}
	}

	render () {
		const { selectColumns, options, selections } = this.props;
		return (
			<Checkboxes
				name="columns"
				onChange={selectColumns}
				options={options}
				selections={selections} 
			/>
		);
	}
}

export default connect(
	state => ({
		options: state.main.data ? Object.keys(state.main.data[0]) : [],
		selections: state.main.showColumns,
		dataClass: state.main.dataClass,
		savedQuery: state.main.selectedSavedQueryID
	}),

	dispatch => ({
		selectColumns(opts) {
			dispatch(selectColumns(opts));
		}
	})
)(ColumnSelection);