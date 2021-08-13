import React, { useState, useEffect } from "react";
import "./BoardContent.scss";
import { initialData } from "actions/initialData";
import { isEmpty } from "lodash";
import Column from "components/Column/Column";
import { mapOrder } from "utilities/sort";
import { Container, Draggable } from "react-smooth-dnd";

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
			mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id");
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

	const onColumnDrop = (dropResult) => {
		console.log(dropResult);
	};

	return (
		<div className="board-content">
			<Container
				orientation="horizontal"
				onDrop={onColumnDrop}
				getChildPayload={(index) => {
					return columns[index];
				}}
				dragHandleSelector=".column-drag-handle"
				dropPlaceholder={{
					animationDuration: 150,
					showOnTop: true,
					className: "column-drop-preview",
				}}
			>
				{columns.map((column, index) => {
					// Xử lý dữ liệu
					return (
						<Draggable
							style={{
								paddingRight: "10px",
							}}
							key={index}
						>
							<Column column={column} />
						</Draggable>
					);
				})}
			</Container>
		</div>
	);
}

export default BoardContent;
