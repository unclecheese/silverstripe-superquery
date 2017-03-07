import React from 'react';
import { connect } from 'react-redux';
import ColumnSelection from './ColumnSelection';
import { toggleColumnWindow } from '../../actions';

class ColumnWindow extends React.Component {

	render() {
		const { active, toggle } = this.props;
		return (
			<div className={`column-window ${active ? 'active' : ''}`}>
				<span className="close" onClick={toggle}>&times;</span>
				<ColumnSelection />
			</div>
		);
	}
}

export default connect(
	state => ({
		active: state.main.showColumnWindow
	}),
	dispatch => ({
		toggle (e) {
			e.preventDefault();
			dispatch(toggleColumnWindow());
		}
	})
)(ColumnWindow);