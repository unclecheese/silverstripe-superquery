import React from 'react';
import 'fixed-data-table/dist/fixed-data-table.css';
import Messages from '../containers/Messages';
import QueryBar from '../containers/QueryBar';
import ResultsTable from '../containers/ResultsTable';

class App extends React.Component {


	render () {

		return (
			<div className="app">
				<QueryBar />
				<Messages />
				<ResultsTable />
			</div>
		);
	}
}

export default App;