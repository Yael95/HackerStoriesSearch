import React, {
	useState,
	useEffect,
	useRef,
	useReducer,
	useCallback,
} from "react";
import axios from "axios";
import "./App.css";
import List from "./List";
import { SearchForm } from "./SearchForm";

/******************API */
const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
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
				data:
					action.payload.page === 0
						? action.payload.list
						: state.data.concat(action.payload.list),
				page: action.payload.page,
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
const extractSearchTerm = (url) =>
	url
		.substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"))
		.replace(PARAM_SEARCH, "");

const getUrl = (searchTerm, page) =>
	`${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const getLastSearches = (urls) =>
	urls
		.reduce((result, url, index) => {
			const searchTerm = extractSearchTerm(url);

			if (index === 0) {
				return result.concat(searchTerm);
			}

			const previousSearchTerm = result[result.length - 1];

			if (searchTerm === previousSearchTerm) {
				return result;
			} else {
				return result.concat(searchTerm);
			}
		}, [])
		.slice(-6)
		.slice(0, -1);
/*******************App component */
const App = () => {
	/******************State definitions (hooks) */
	const [searchTerm, setSearchTerm] = useSemiPersistentData(
		"search",
		"Morocco"
	);
	const [stories, dispatchStories] = useReducer(storiesReducer, {
		data: [],
		page: 0,
		isLoading: false,
		isError: true,
	});
	const [urls, setUrls] = useState([getUrl(searchTerm, 0)]);

	/**********************UseEffect  */
	const handleFetchStories = useCallback(async () => {
		dispatchStories({ type: "STORIES_FETCH_INIT" });
		try {
			const lastUrl = urls[urls.length - 1];
			const result = await axios.get(lastUrl);
			dispatchStories({
				type: "STORIES_FETCH_SUCCESS",
				payload: { list: result.data.hits, page: result.data.page },
			});
		} catch {
			dispatchStories({ type: "STORIES_FETCH_FAILURE" });
		}
	}, [urls]);
	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);
	/*********Utility & Callback Handlers */
	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	};
	const handleSearch = (searchTerm, page) => {
		const url = getUrl(searchTerm, page);
		setUrls(urls.concat(url));
	};
	const handleSearchSubmit = (event) => {
		handleSearch(searchTerm);
		event.preventDefault();
	};
	const handleLastSearch = (searchTerm) => {
		setSearchTerm(searchTerm);
		handleSearch(searchTerm);
	};
	const handleRemoveStory = (item) => {
		dispatchStories({ type: "REMOVE_STORY", payload: item });
	};
	const handleMore = () => {
		const lastUrl = urls[urls.length - 1];
		const searchTerm = extractSearchTerm(lastUrl);
		handleSearch(searchTerm, stories.page + 1);
	};
	const lastSearches = getLastSearches(urls);
	/************************************JSX To be Rendered */

	return (
		<div className="container">
			<h1 className="headlinePrimary">My Hacker Stories</h1>
			<SearchForm
				searchTerm={searchTerm}
				onSearchInput={handleSearchInput}
				onSearchSubmit={handleSearchSubmit}
			/>
			<LastSearches
				lastSearches={lastSearches}
				onLastSearch={handleLastSearch}
			/>
			<hr />
			{stories.isError && <p>Something went Wrong...</p>}
			{stories.isLoading ? (
				<p>Loading Data ....</p>
			) : (
				<List list={stories.data} onRemoveItem={handleRemoveStory} />
			)}
			<button className="button buttonLarge" type="button" onClick={handleMore}>
				More
			</button>
		</div>
	);
};
/*************Other Components */
const LastSearches = ({ lastSearches, onLastSearch }) => (
	<>
		{" "}
		{lastSearches.map((searchTerm, index) => (
			<button
				className="button buttonSmall"
				type="button"
				onClick={() => onLastSearch(searchTerm)}
				key={searchTerm + index}>
				{searchTerm}
			</button>
		))}
	</>
);
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
