import React, { useState, useEffect } from "react";
import "./App.css";
/***********************Custom Hooks */
const useSemiPersistentData = (key, initialState) => {
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);
	useEffect(() => {
		localStorage.setItem(key, value);
	}, [value, key]);
	return [value, setValue];
};
const App = () => {
	const stories = [
		{
			title: "React",
			url: "https://reactjs.org/",
			author: "Jordan Walke",
			num_comments: 3,
			points: 4,
			objectID: 0,
		},
		{
			title: "Redux",
			url: "https://redux.js.org/",
			author: "Dan Abramov, Andrew Clark",
			num_comments: 2,
			points: 5,
			objectID: 1,
		},
	];

	/******************State definitions (hooks) */
	const [searchTerm, setSearchTerm] = useSemiPersistentData("search", "React");

	/*********Utility & Callback Handlers */
	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};
	const searchedStories = stories.filter((story) => {
		return story.title.toLowerCase().includes(searchTerm.toLowerCase());
	});
	/************************************JSX To be Rendered */

	return (
		<div>
			<h1>My Hacker Stories</h1>
			<InputwithLabel
				id="search"
				value={searchTerm}
				onInputChange={handleSearch}>
				<strong>Search :</strong>
			</InputwithLabel>
			<hr />
			<List list={searchedStories} />
		</div>
	);
};
const InputwithLabel = ({
	id,
	children,
	type = "text",
	value,
	onInputChange,
}) => (
	<>
		<label htmlFor={id}>{children}</label>
		<input type={type} id={id} value={value} onChange={onInputChange} />
	</>
);

const List = ({ list }) =>
	list.map((item) => <Item key={item.objectID} item={item} />);

const Item = ({ item }) => (
	<div>
		<span>
			<a href={item.url}>{item.title}</a>
		</span>
		<span>{item.author}</span>
		<span>{item.num_comments}</span>
		<span>{item.points}</span>
	</div>
);
export default App;
