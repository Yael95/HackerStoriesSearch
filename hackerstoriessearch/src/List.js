import React, { useState } from "react";
import { Item } from "./Item";
import { sortBy } from "lodash";
const List = ({ list, onRemoveItem }) => {
	const SORTS = {
		NONE: (list) => list,
		TITLE: (list) => sortBy(list, "title"),
		AUTHOR: (list) => sortBy(list, "author"),
		COMMENT: (list) => sortBy(list, "num_comments").reverse(),
		POINT: (list) => sortBy(list, "points").reverse(),
	};
	const [sort, setSort] = useState({ sortKey: "NONE", isReverse: false });
	const handleSort = (sortKey) => {
		const isReverse = sort.sortKey === sortKey && !sort.isReverse;
		setSort({ sortKey, isReverse });
	};
	const sortFunction = SORTS[sort.sortKey];
	const sortedList = sort.isReverse
		? sortFunction(list).reverse()
		: sortFunction(list);
	return (
		<div>
			<div style={{ display: "flex" }}>
				<span style={{ width: "40%" }}>
					<button
						className="button buttonSmall"
						type="button"
						onClick={() => handleSort("TITLE")}>
						Title
					</button>
				</span>
				<span style={{ width: "30%" }}>
					<button
						className="button buttonSmall"
						type="button"
						onClick={() => handleSort("AUTHOR")}>
						Author
					</button>
				</span>
				<span style={{ width: "10%" }}>
					<button
						className="button buttonSmall"
						type="button"
						onClick={() => handleSort("COMMENT")}>
						Comments
					</button>
				</span>
				<span style={{ width: "10%" }}>
					<button
						className="button buttonSmall"
						type="button"
						onClick={() => handleSort("POINT")}>
						Points
					</button>
				</span>
				<span style={{ width: "10%" }}>Actions</span>
			</div>
			{sortedList.map((item) => (
				<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
			))}
		</div>
	);
};
export default List;
