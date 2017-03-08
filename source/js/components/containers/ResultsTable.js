import React from 'react';
import { connect } from 'react-redux';
import { submitQuery, updateColumnWidths } from '../../actions';
import getTextWidth from '../../utils/getTextWidth';
import SortHeaderCell from '../containers/SortHeaderCell';
import ColumnWindow from '../containers/ColumnWindow';
import Footer from '../containers/Footer';
import getDefaultColumnWidths from '../../utils/getDefaultColumnWidths';
import { Table, Column, Cell } from 'fixed-data-table';

class ResultsTable extends React.Component {

	constructor(props) {
		super(props);
		this.onColumnResize = this.onColumnResize.bind(this);	
	}

	componentWillReceiveProps(nextProps) {
		const {sortDir, sortCol, data, page, dataClass} = nextProps;

		if(nextProps.data && nextProps.data.length) {		
			const columnData = nextProps.columnWidths[dataClass];
			if(!columnData) {
				this.props.updateColumnWidths(
					dataClass, 
					getDefaultColumnWidths(nextProps.data)
				);
			}
		}
		if(
			sortDir !== this.props.sortDir || 
			sortCol !== this.props.sortCol ||
			page !== this.props.page
		) {
			this.props.submitQuery(
				this.props.query,
				{
					sortDir: sortDir == -1 ? 'DESC' : 'ASC',
					sortCol,
					offset: (page-1)*data.length
				}
			);
		}

	}

	onColumnResize(newWidth, column) {
		const {updateColumnWidths, dataClass, columnWidths} = this.props;

		updateColumnWidths(
			dataClass,
			{
				...columnWidths[dataClass],
				[column]: newWidth
			}
		);
	}

	render() {
		const {data, width, height, columnWidths, dataClass, toggleColumnWindow, showColumns} = this.props;

		if(!data || data.length === 0) return <div />;
		let columns = Object.keys(data[0]).filter(c => showColumns.indexOf(c) !== -1);

		const w = columnWidths[dataClass];
		if(w) {
			columns = columns.map((column,i) => {
				const width = Math.min(
					w[column],
					500
				);			    
			    return (
				    <Column
				      columnKey={column}
				      key={column}
				      header={<SortHeaderCell columnKey={column}>{column}</SortHeaderCell>}
				      cell={cellData => {					      	
				      	return <Cell>{data[cellData.rowIndex][column]}</Cell>
				      }}
				      width={width}
				      isResizable={true}							      
				    />
			    );
			});					    
		}

		const tableWidth = (width-250);
		const tableHeight = height*0.6;

		return (
       	<div className="table-wrapper" style={{width: tableWidth}}>
		  <Table
		    rowHeight={30}
		    rowsCount={data.length}
		    width={tableWidth}
		    height={tableHeight}
		    onColumnResizeEndCallback={this.onColumnResize}
		    isColumnResizing={false}				    
		    headerHeight={50}>
	    		{columns}
		  </Table>
		  <Footer />
		  <ColumnWindow />
		</div>
		);
   		

	}
}

export default connect(
	state => ({
		data: state.main.data,
		dataClass: state.main.dataClass || (state.main.data && state.main.data.length && state.main.data[0].ClassName),
		sortCol: state.main.sortCol,
		sortDir: state.main.sortDir,
		columnWidths: state.main.columnWidths,
		page: state.main.page,
		hasMore: state.main.hasMore,
		query: state.main.query,		
		width: state.main.viewportWidth,
		height: state.main.viewportHeight,
		showColumns: state.main.showColumns
	}),

	dispatch => ({
		submitQuery(query, params = {}) {
			dispatch(submitQuery(query, params));
		},
		
		updateColumnWidths(dataClass, widths) {
			dispatch(updateColumnWidths({dataClass, widths}));
		}
	})

)(ResultsTable);
