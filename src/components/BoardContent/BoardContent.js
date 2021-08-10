import React, { useState, useEffect } from "react";
import "./BoardContent.scss";
import { initialData } from "actions/initialData";
import { isEmpty } from "lodash";
import Column from "components/Column/Column";
import { mapOrder } from "utilities/sort";

function BoardContent() {
	const [board, setBoard] = useState({});
	const [columns, setColumns] = useState({});

	useEffect(() => {
		// effect
		const boardFromDB = initialData.boards.find(
			(board) => board.id === "board-1"
		);
		if (boardFromDB) {
			setBoard(boardFromDB);
			// sort column
			mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id" )
			setColumns(boardFromDB.columns);
		}
		return () => {
			// cleanup
		};
	}, []);

	if (isEmpty(board)) {
		return (
			<div
				className="not-found"
				style={{
					padding: "10px",
					color: "white",
				}}
			>
				Board not found!
			</div>
		);
	}
	return (
		<div className="board-content">
			{columns.map((column, index) => {
				// Xử lý dữ liệu
				return <Column key={index} column={column} />;
			})}
		</div>
	);
}

export default BoardContent;
