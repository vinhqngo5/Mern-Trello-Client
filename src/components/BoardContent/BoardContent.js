import React, { useState, useEffect } from "react";
import "./BoardContent.scss";
import { initialData } from "actions/initialData";
import { isEmpty } from "lodash";
import Column from "components/Column/Column";
import { mapOrder } from "utilities/sort";
import { applyDrag } from "utilities/dragDrop";
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
		let newColumns = [...columns];
		newColumns = applyDrag(newColumns, dropResult);

		let newBoard = { ...board };
		newBoard.columnOrder = newColumns.map((c) => c.id);
		newBoard.columns = newColumns;

		setColumns(newColumns);
		setBoard(newBoard);
	};

	const onCardDrop = (columnId, dropResult) => {
		if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
			let newColumns = [...columns];
			let currentColumn = newColumns.find((c) => c.id === columnId);
			currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
			currentColumn.cardOrder = currentColumn.cards.map((card) => card.id);
			setColumns(newColumns);
		}
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
							<Column column={column} onCardDrop={onCardDrop} />
						</Draggable>
					);
				})}
			</Container>
		</div>
	);
}

export default BoardContent;
