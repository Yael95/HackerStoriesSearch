import React, { useState } from "react";
import { Item } from "./Item";
import { sortBy } from "lodash";
import { ReactComponent as UpArrow } from "./up-arrow-angle.svg";
import { ReactComponent as DownArrow } from "./down-arrow-of-angle.svg";
const List = ({ list, onRemoveItem }) => {
	const SORTS = {
		NONE: (list) => list,
		TITLE: (list) => sortBy(list, "title"),
		AUTHOR: (list) => sortBy(list, "author"),
		COMMENT: (list) => sortBy(list, "num_comments").reverse(),
		POINT: (list) => sortBy(list, "points").reverse(),
	};
	const [arrow, setArrow] = useState("NONE");

	const addArrows = () => {
		if (arrow === "UP") {
			return (
				<>
					<UpArrow height="18px" width="18px" />
					<p style={{ fontSize: "10px" }}>Sorted by {sort.sortKey}</p>
				</>
			);
		} else if (arrow === "DOWN") {
			return (
				<>
					<DownArrow height="18px" width="18" />
					<p style={{ fontSize: "10px" }}>Sorted by {sort.sortKey}</p>
				</>
			);
		}
	};
	const [sort, setSort] = useState({ sortKey: "NONE", isReverse: false });
	const handleSort = (sortKey) => {
		const isReverse = sort.sortKey === sortKey && !sort.isReverse;
		setSort({ sortKey, isReverse });
		isReverse ? setArrow("UP") : setArrow("DOWN");
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
					&nbsp;
				</span>
				<span style={{ width: "30%" }}>
					<button
						className="button buttonSmall"
						type="button"
						onClick={() => handleSort("AUTHOR")}>
						Author
					</button>
					&nbsp;
				</span>
				<span style={{ width: "10%" }}>
					<button
						className="button buttonSmall"
						type="button"
						onClick={() => handleSort("COMMENT")}>
						Comments
					</button>
					&nbsp;
				</span>
				<span style={{ width: "10%" }}>
					<button
						className="button buttonSmall"
						type="button"
						onClick={() => {
							handleSort("POINT");
							addArrows();
						}}>
						Points
					</button>
					&nbsp;
				</span>
				<span style={{ width: "10%" }}>{addArrows()}</span>
			</div>
			{sortedList.map((item) => (
				<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
			))}
		</div>
	);
};
export default List;
