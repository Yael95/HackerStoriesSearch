import React from "react";
import { InputwithLabel } from "./App";
export const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
	return (
		<form className="searchForm" onSubmit={onSearchSubmit}>
			<InputwithLabel
				id="search"
				value={searchTerm}
				isFocused
				onInputChange={onSearchInput}>
				<strong>Search :</strong>
			</InputwithLabel>
			<button
				type="button"
				className="button buttonLarge"
				disabled={!searchTerm}>
				Submit
			</button>
		</form>
	);
};
