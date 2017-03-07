/*eslint-disable */
export const main = function (
	state = {
		errorMsg: null,
		query: "",
		loading: false,
		dataClass: null,
		data: [],		
		columnWidths: {},
		viewportWidth: window.innerWidth,
		viewportHeight: window.innerHeight,
		sortDir: 1,
		sortCol: null,
		initialised: false,
		hasMore: false,
		size: 0,
		page: 1,
		totalPages: 0,
		showColumnWindow: false,
		showQueryList: false,
		showColumns: [],
		savedQueries: [],
		selectedSavedQueryID: null
	}, 
	action = {}) {
		switch(action.type) {
			case 'THROW_ERROR':

				return {
					...state,
					errorMsg: action.payload,
					loading: false
				};
			case 'CLEAR_ERROR':
				return {
					...state,
					errorMsg: null
				};

			case 'UPDATE_QUERY':
				return {
					...state,
					query: action.payload
				}
			case 'TOGGLE_LOADING':
				return {
					...state,
					loading: !!action.payload
				}
			case 'RECEIVE_RESULTS':
				return {
					...state,
					data: action.payload.items,
					dataClass: action.payload.dataClass,
					size: action.payload.totalSize,
					totalPages: action.payload.totalPages,
					page: action.payload.page,
					hasMore: action.payload.hasMore,
					initialised: true,
					errorMsg: null
				}
			case 'UPDATE_VIEWPORT':
				return {
					...state,
					viewportWidth: action.payload.width,
					viewportHeight: action.payload.height
				}				
			case 'UPDATE_COLUMN_WIDTHS':
				return {
					...state,
					columnWidths: {
						...state.columnWidths,
						[action.payload.dataClass]: action.payload.widths
					}
				}
			case 'UPDATE_SORT':			
				return {
					...state,
					sortCol: action.payload.column,
					sortDir: action.payload.dir
				}
			case 'UPDATE_PAGE':
				return {
					...state,
					page: action.payload
				}
			case 'TOGGLE_COLUMN_WINDOW':
				return {
					...state,
					showColumnWindow: !state.showColumnWindow
				}
			case 'SELECT_COLUMNS':
				return {
					...state,
					showColumns: [
						...action.payload
					]
				}
			case 'RECEIVE_QUERIES':			 	
				return {
					...state,
					savedQueries: [...action.payload]
				}
			case 'DELETE_QUERY':
				return {
					...state,
					savedQueries: state.savedQueries.filter(q => q.id != action.payload),
					selectedSavedQueryID: null
				}
			case 'ADD_QUERY':
				return {
					...state,
					savedQueries: [
						...state.queries,
						action.payload
					]
				}
			case 'SET_QUERY_STATE':
				const { 
					query, 
					dataClass, 
					columnWidths, 
					sortDir, 
					sortCol, 
					initialised, 
					showColumns
				} = action.payload;

				const newState = {
					...state,
					query,
					dataClass,
					columnWidths,
					sortDir,
					sortCol,
					initialised,
					showColumns
				};
				return newState;
			case 'SHOW_QUERY_LIST':
				return {
					...state,
					showQueryList: true
				};
			case 'SELECT_SAVED_QUERY':
				return {
					...state,
					selectedSavedQueryID: action.payload
				}
			default:
				return state;

		}
};
/*eslint-enable */
