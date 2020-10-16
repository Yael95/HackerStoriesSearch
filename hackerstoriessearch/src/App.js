import React, { useState } from "react";
import "./App.css";

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
	/******************State definitions */
	const [searchTerm, setSearchTerm] = useState("React");
	/********************************** */

	/*********Utility & Callback Handlers */
	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};
	const searchedStories = stories.filter((story) => {
		return story.title.toLowerCase().includes(searchTerm.toLowerCase());
	});
	/************************************ */

	return (
		<div>
			<h1>My Hacker Stories</h1>
			<Search search={searchTerm} onSearch={handleSearch} />
			<hr />
			<List list={searchedStories} />
		</div>
	);
};
const Search = (props) => {
	return (
		<div>
			<label htmlFor="search">Search :</label>
			<input
				type="text"
				id="search"
				value={props.search}
				onChange={props.onSearch}
			/>
		</div>
	);
};
const List = (props) =>
	props.list.map((item) => {
		return (
			<div key={item.objectID}>
				<span>
					<a href={item.url}>{item.title}</a>
				</span>
				<span>{item.author}</span>
				<span>{item.num_comments}</span>
				<span>{item.points}</span>
			</div>
		);
	});

export default App;