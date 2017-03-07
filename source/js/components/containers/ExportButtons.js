import React from 'react';
import {connect} from 'react-redux';
import URL from '../../utils/url';

const ExportButtons = ({
	sortDir,
	sortCol,
	query,
	cols
}) => (
	<span className="button-group">
		<strong>Export as</strong>:
		{['json', 'csv'].map(format => (
			<a key={format} href={URL.addQueryParams(
				'/admin/superquery/api',
				{sortDir, sortCol, query, format, cols}
				)}>
				{format}
			</a>

		))}
	</span>
);

export default connect(
	state => ({
		sortDir: state.main.sortDir,
		sortcol: state.main.sortCol,
		query: state.main.query,
		cols: state.main.showColumns
	})
)(ExportButtons);