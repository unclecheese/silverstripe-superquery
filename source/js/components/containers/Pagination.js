import React from 'react';
import {connect} from 'react-redux';
import {updatePage} from '../../actions';
class PaginationCell extends React.Component {

	constructor(props) {
		super(props);
		this.handleTyping = this.handleTyping.bind(this);
		this.goFirst = this.goFirst.bind(this);
		this.goLast = this.goLast.bind(this);
		this.goNext = this.goNext.bind(this);
		this.goPrev = this.goPrev.bind(this);
		
		this.state = {
			page: this.props.page
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.page !== this.state.page) {
			this.setState({
				page: nextProps.page
			});
		}
	}

	handleTyping(e) {
		if(e.keyCode === 13) {
			this.props.updatePage(this.state.page)
		}
		else {
			this.setState({
				page: e.target.value
			});
		}
	}

	goFirst() {
		if(this.props.page !== 1) {
			this.props.updatePage(1);
		}
	}

	goLast() {
		if(this.props.hasMore) {
			this.props.updatePage(this.props.totalPages);
		}
	}

	goNext() {
		if(this.props.hasMore) {
			this.props.updatePage(this.props.page + 1);
		}
	}

	goPrev() {
		if(this.props.page !== 1) {
			this.props.updatePage(this.props.page - 1);
		}
	}

	render() {
		const {hasMore, firstPage, prevPage, nextPage, lastPage} = this.props;
		const {page} = this.state;

		return (
			<span className="pagination-cell">
				<a onClick={this.goFirst}><i className={`fa fa-fast-backward ${page === 1 ? 'disabled' : ''}`} /></a>
				<a onClick={this.goPrev}><i className={`fa fa-step-backward ${page === 1 ? 'disabled' : ''}`} /></a>
				<input type="text" value={page} onChange={this.handleTyping} onKeyUp={this.handleTyping} />
				<a onClick={this.goNext}><i className={`fa fa-step-forward ${!hasMore ? 'disabled' : ''}`} /></a>
				<a onClick={this.goLast}><i className={`fa fa-fast-forward ${!hasMore ? 'disabled' : ''}`} /></a>
			</span>
		);

	}
}

export default connect (
	state => ({
		page: state.main.page,
		totalPages: state.main.totalPages,
		hasMore: state.main.hasMore
	}),

	dispatch => ({
		updatePage(page) {
			dispatch(updatePage(page));
		}
	})
)(PaginationCell);