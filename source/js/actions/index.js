/*eslint-disable */
import { responseHandler, cancel, schedule } from '../utils/ajax';
import request from 'superagent';
import URL from '../utils/url';

let http = request;
let activeRequest = null;
export function setHTTPClient (client) {
	http = client;
}

const createAction = type => payload => ({
	type,
	payload
});

function ajax(method, url, data = null) {
  if(activeRequest) activeRequest.abort();
  return new Promise((resolve, reject) => {    
    method = method.toUpperCase();

    if (method === 'POST') {
		activeRequest = http.post(url).send(data).type('form');
    } else if(method === 'PUT') {
    	activeRequest = http.put(url).send(data).type('form');
    } else if(method === 'DELETE') {
    	activeRequest = http.del(url).send(data).type('form');
    } else {
		activeRequest = http.get(URL.addQueryParams(url, data));
    }

    activeRequest.end((err, res) => {    	
		if (res.ok) {
			resolve(res.text);
		} 
		else {
			reject(res.text);
		}
		activeRequest = null;		
    });
  });
}

function generateSavedState(state) {
	const {
		query, 
		dataClass, 
		columnWidths, 
		sortDir, 
		sortCol, 
		initialised, 
		showColumns
	} = state.main;

	return JSON.stringify({
		query,
		dataClass,
		columnWidths,
		sortDir,
		sortCol,
		initialised,
		showColumns
	});
}

export const updateQuery = createAction('UPDATE_QUERY');
export const toggleLoading = createAction('TOGGLE_LOADING');
export const throwError = createAction('THROW_ERROR');
export const receiveResults = createAction('RECEIVE_RESULTS');
export const updateColumnWidths = createAction('UPDATE_COLUMN_WIDTHS');
export const sortColumn = createAction('UPDATE_SORT');
export const updatePage = createAction('UPDATE_PAGE');
export const toggleColumnWindow = createAction('TOGGLE_COLUMN_WINDOW');
export const selectColumns = createAction('SELECT_COLUMNS');
export const receiveQueries = createAction('RECEIVE_QUERIES');
export const deleteQuery = createAction('DELETE_QUERY');
export const addQuery = createAction('ADD_QUERY');
export const showQueryList = createAction('SHOW_QUERY_LIST');
export const setQueryState = createAction('SET_QUERY_STATE');
export const selectSavedQuery = createAction('SELECT_SAVED_QUERY');

export const submitQuery = function(query, params) {
	return async (dispatch, getState) => {
		dispatch(toggleLoading(true));
		try {
			const response = await ajax(
				'GET',
				'admin/superquery/api',
				{query, ...params}
			).then(JSON.parse);
			dispatch(toggleLoading(false));
			dispatch(receiveResults(response));
		} catch (e) {
			dispatch(throwError(e));
		}
	}
}

export const getQueries = function () {
	return async (dispatch, getState) => {
		dispatch(toggleLoading(true));
		try {
			const response = await ajax(
				'GET',
				'admin/superquery/api/savedquery'
			).then(JSON.parse);
			dispatch(toggleLoading(false));
			dispatch(receiveQueries(response));
		} catch (e) {
			dispatch(throwError(e));
		}
	}
}

export const saveQuery = function (title, state) {
	return async (dispatch, getState) => {
		dispatch(toggleLoading(true));		
		try {
			const savedState = generateSavedState(getState());
			const response = await ajax(
				'POST',
				'admin/superquery/api/savedquery',
				{title, state: savedState}
			);
			dispatch(getQueries());
		} catch (e) {
			dispatch(throwError(e));
		}
	}
}

export const updateSavedQuery = function (id) {
	return async (dispatch, getState) => {
		dispatch(toggleLoading(true));		
		try {
			const savedState = generateSavedState(getState());
			const response = await ajax(
				'PUT',
				`admin/superquery/api/savedquery/${id}`,
				{state: savedState}
			);
			alert('This query has been updated to show the current view');
			dispatch(getQueries());
		} catch (e) {
			dispatch(throwError(e));
		}
	}
}

export const destroyQuery = function (id) {
	return async (dispatch, getState) => {
		dispatch(toggleLoading(true));
		dispatch(deleteQuery(id));
		try {
			const response = await ajax(
				'DELETE',
				`admin/superquery/api/savedquery/${id}`
			);
			dispatch(toggleLoading(false));
		} catch (e) {
			dispatch(throwError(e));
		}
	}
}

export const runSavedQuery = function (id) {
	return (dispatch, getState) => {
		const query = getState().main.savedQueries.find(q => q.id == id);
		if(query) {
			const state = JSON.parse(query.state);
			dispatch(setQueryState(state));
			dispatch(submitQuery(
				state.query, 
				{
					sortDir: state.sortDir,
					sortCol: state.sortCol
				}
			));
		}

	}
}