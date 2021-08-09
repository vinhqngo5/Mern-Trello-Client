import React from "react";
import "./Column.scss";
import Card from "components/Card/Card";
function Column() {
	return (
		<div className="column">
			<header>Brain Storm</header>
			<ul className="card-list">
				<Card />
				<Card />
				<li className="card-item">Add whay you'd like to work on below</li>
				<li className="card-item">Add whay you'd like to work on below</li>
				<li className="card-item">Add whay you'd like to work on below</li>
			</ul>
			<footer>Add another card</footer>
		</div>
	);
}

export default Column;
