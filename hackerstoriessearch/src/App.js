import React, {
	useState,
	useEffect,
	useRef,
	useReducer,
	useCallback,
} from "react";
import axios from "axios";
import "./App.css";
import  List  from "./List";
import { SearchForm } from "./SearchForm";

/******************API */
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

/*******************Custom Reducer */
const storiesReducer = (state, action) => {
	switch (action.type) {
		case "STORIES_FETCH_INIT":
			return {
				...state,
				isLoading: true,
				isError: false,
			};
		case "STORIES_FETCH_SUCCESS":
			return {
				...state,
				isLoading: false,
				isError: false,
				data: action.payload,
			};
		case "STORIES_FETCH_FAILURE":
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		case "REMOVE_STORY":
			return {
				...state,
				data: state.data.filter(
					(story) => action.payload.objectID !== story.objectID
				),
			};
		default:
			throw new Error();
	}
};
/***********************Custom Hooks */
const useSemiPersistentData = (key, initialState) => {
	const isMounted = useRef(false);
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);
	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
		} else {
			localStorage.setItem(key, value);
		}
	}, [value, key]);
	return [value, setValue];
};
/*******************Function Utilities */

/*******************App component */
const App = () => {
	/******************State definitions (hooks) */
	const [searchTerm, setSearchTerm] = useSemiPersistentData(
		"search",
		"Morocco"
	);
	const [stories, dispatchStories] = useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: true,
	});
	const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

	/**********************UseEffect  */
	const handleFetchStories = useCallback(async () => {
		dispatchStories({ type: "STORIES_FETCH_INIT" });
		try {
			const result = await axios.get(url);
			dispatchStories({
				type: "STORIES_FETCH_SUCCESS",
				payload: result.data.hits,
			});
		} catch {
			dispatchStories({ type: "STORIES_FETCH_FAILURE" });
		}
	}, [url]);
	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);
	/*********Utility & Callback Handlers */
	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = (event) => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);
		event.preventDefault();
	};

	const handleRemoveStory = (item) => {
		dispatchStories({ type: "REMOVE_STORY", payload: item });
	};
	/************************************JSX To be Rendered */

	return (
		<div className="container">
			<h1 className="headlinePrimary">My Hacker Stories</h1>
			<SearchForm
				searchTerm={searchTerm}
				onSearchInput={handleSearchInput}
				onSearchSubmit={handleSearchSubmit}
			/>

			{stories.isError && <p>Something went Wrong...</p>}
			{stories.isLoading ? (
				<p>Loading Data ....</p>
			) : (
				<List list={stories.data} onRemoveItem={handleRemoveStory} />
			)}
		</div>
	);
};
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
export default App;
