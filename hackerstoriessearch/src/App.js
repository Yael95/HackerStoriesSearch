import React, {
	useState,
	useEffect,
	useRef,
	useReducer,
	useCallback,
} from "react";
import "./App.css";
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
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);
	useEffect(() => {
		localStorage.setItem(key, value);
	}, [value, key]);
	return [value, setValue];
};
/*******************App component */
const App = () => {
	/******************State definitions (hooks) */
	const [searchTerm, setSearchTerm] = useSemiPersistentData("search", "React");
	const [stories, dispatchStories] = useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: true,
	});
	const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

	/**********************UseEffect  */
	const handleFetchStories = useCallback(() => {
		dispatchStories({ type: "STORIES_FETCH_INIT" });
		fetch(url)
			.then((response) => response.json())
			.then((result) => {
				dispatchStories({
					type: "STORIES_FETCH_SUCCESS",
					payload: result.hits,
				});
			})
			.catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
	}, [url]);
	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);
	/*********Utility & Callback Handlers */
	const handleSearchInput = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleSearchSubmit = () => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);
	};

	const handleRemoveStory = (item) => {
		dispatchStories({ type: "REMOVE_STORY", payload: item });
	};
	/************************************JSX To be Rendered */

	return (
		<div>
			<h1>My Hacker Stories</h1>
			<InputwithLabel
				id="search"
				value={searchTerm}
				isFocused
				onInputChange={handleSearchInput}>
				<strong>Search :</strong>
			</InputwithLabel>
			<button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
				Submit
			</button>
			<hr />
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
const InputwithLabel = ({
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
			<label htmlFor={id}>{children}</label>
			&nbsp;
			<input
				ref={inputRef}
				type={type}
				id={id}
				value={value}
				autoFocus={isFocused}
				onChange={onInputChange}
			/>
		</>
	);
};

const List = ({ list, onRemoveItem }) =>
	list.map((item) => (
		<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
	));

const Item = ({ item, onRemoveItem }) => {
	const handleRemoveItem = () => {
		onRemoveItem(item);
	};
	return (
		<div>
			<span>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
			<button type="button" onClick={handleRemoveItem}>
				Dismiss
			</button>
		</div>
	);
};
export default App;
