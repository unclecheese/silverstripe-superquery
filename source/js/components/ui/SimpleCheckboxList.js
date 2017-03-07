import React from 'react';

const SimpleCheckboxList = ({
	options = [],
	selections = [],
	className,
	onChange,
	name
}) => {
	const opts = options.map(o => {
		let label, value;
		if(typeof o === 'object') {
			if(!o.value) {
				throw new Error('Checkboxes passed an option with no value');
			}
			value = o.value;
			label = o.label;
		} else if((/string|number|boolean/).test(typeof o)) {
			value = o;
			label = o;
		} else {
			throw new Error(`Checkboxes passed invalid option: ${typeof o}`);
		}

		return {value, label}
	}) 

	return (
		<ul className={`checkboxes ${className || ''}`}>
			{opts.map(o => (
				<li key={o.value}>
					<input 
						type="checkbox"
						name={o.value}
						checked={selections.indexOf(o.value) !== -1}
						id={`${name}-${o.value}`}
						onChange={(e) => {
							if(e.target.checked) {
								onChange([
									...selections,
									o.value
								]);
							}
							else {
								onChange(selections.filter(s => s !== o.value));
							}
						}}
						/>
					<label htmlFor={`${name}-${o.value}`}>
						{o.label}
					</label>
				</li>
			))}
		</ul>
	);
}

SimpleCheckboxList.propTypes = {
	options: React.PropTypes.array.isRequired,
	selections: React.PropTypes.array,
	className: React.PropTypes.string,
	onChange: React.PropTypes.func,
	name: React.PropTypes.string

};

export default SimpleCheckboxList;