import getTextWidth from './getTextWidth';

export default function (data) {
	const columnData = {};
	// Set the initial length to the header
	Object.keys(data[0]).forEach(k => {
		columnData[k] = Math.ceil(getTextWidth(k, '12px Arial')+16);
	});

	data.forEach(row => {
		for(let k in row) {
			columnData[k] = Math.max(Math.ceil(getTextWidth(row[k], '12px Arial')+16), columnData[k]);				
		}
	})

	return columnData;
};
