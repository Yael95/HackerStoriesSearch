import React from "react";
import { ReactComponent as Check } from "./check.svg";
export const Item = ({ item, onRemoveItem }) => {
	const handleRemoveItem = () => {
		onRemoveItem(item);
	};
	return (
		<div style={{ display: "flex" }} className="item">
			<span style={{ width: "40%" }}>
				<a href={item.url}>{item.title}</a>
			</span>
			<span style={{ width: "30%" }}>{item.author}</span>
			<span style={{ width: "10%" }}>{item.num_comments}</span>
			<span style={{ width: "10%" }}>{item.points}</span>
			<span style={{ width: "10%" }}></span>
			<button
				type="button"
				className="button buttonSmall"
				onClick={handleRemoveItem}>
				<Check height="18px" width="18px" />
			</button>
		</div>
	);
};
