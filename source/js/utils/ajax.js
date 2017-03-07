import { throwError } from '../actions';

const GENERIC_ERROR = "Yikes. Something seems to be broken. Our web team has been notified, and we apologize fo the inconvenience.";

const xhrs = {};

export const cancel = (key) => {
	if(xhrs[key]) {
		xhrs[key].abort();
		delete xhrs[key];
	}
}

export const schedule = (key, req) => {
	xhrs[key] = req;
};

export const responseHandler = (dispatch, success, errorHandler) => {
    return (err, res) => {
        if (err || !res.ok) {
        	if(errorHandler) {
				errorHandler(err, res);
        	}
        	else {
        		console.log(err, res);
				dispatch(throwError(GENERIC_ERROR));
        	}
        }
        else if(typeof success === 'function') {
        	success(res.body);
        }
    };	
};