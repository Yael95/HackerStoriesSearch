import React, { useEffect, useRef } from "react";
/*************Other Components */
export const InputwithLabel = ({
	id,
	children,
	type = "text",
	value,
	isFocused,
	onInputChange,
}) => {
	const inputRef = useRef();
	useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isFocused]);
	return (
		<>
			<label htmlFor={id} className="label">
				{children}
			</label>
			&nbsp;
			<input
				ref={inputRef}
				type={type}
				id={id}
				value={value}
				className="input"
				autoFocus={isFocused}
				onChange={onInputChange}
			/>
		</>
	);
};
