import React, { useState, useEffect, useRef, useCallback } from "react";
import "./BoardContent.scss";
import { initialData } from "actions/initialData";
import { isEmpty } from "lodash";
import Column from "components/Column/Column";
import { mapOrder } from "utilities/sort";
import { applyDrag } from "utilities/dragDrop";
import { Container, Draggable } from "react-smooth-dnd";
import {
	Col,
	Row,
	Container as BootstrapContainer,
	Form,
	Button,
} from "react-bootstrap";

function BoardContent() {
	const [board, setBoard] = useState({});
	const [columns, setColumns] = useState({});
	const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
	const [newColumnTitle, setNewColumnTitle] = useState("");
	const newColumnInputRef = useRef(null);

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

	useEffect(() => {
		// effect
		if (newColumnInputRef && newColumnInputRef.current) {
			newColumnInputRef.current.focus();
			// highlight the title in input
			newColumnInputRef.current.select();
		}
		return () => {
			// cleanup
		};
	}, [openNewColumnForm]);

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

	const toggleOpenNewColumnForm = () => {
		setOpenNewColumnForm(!openNewColumnForm);
	};

	const addNewColumn = () => {
		// if input is empty => focus
		if (!newColumnTitle) {
			newColumnInputRef.current.focus();
			return;
		}
		const newColumnToAdd = {
			// random 5 characters, will remove when use mongodb
			id: Math.random().toString(36).substr(2, 5),
			boardId: board.id,
			title: newColumnTitle.trim(),
			cardOrder: [],
			cards: [],
		};

		// Change columns and board state
		let newColumns = [...columns, newColumnToAdd];
		let newBoard = { ...board };
		newBoard.columnOrder = newColumns.map((c) => c.id);
		newBoard.columns = newColumns;

		setColumns(newColumns);
		setBoard(newBoard);

		// change input & title state
		setNewColumnTitle("");
		toggleOpenNewColumnForm();
	};

	const onNewColumnTitleChange = useCallback((e) => {
		setNewColumnTitle(e.target.value);
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

			<BootstrapContainer className="trello-clone-container">
				{!openNewColumnForm && (
					<Row>
						<Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
							<i className="fa fa-plus icon" />
							&nbsp;Add another column
						</Col>
					</Row>
				)}
				{openNewColumnForm && (
					<Row>
						<Col className="enter-new-column">
							<Form.Control
								size="sm"
								type="text"
								placeholder="Enter column title"
								className="input-enter-new-column"
								ref={newColumnInputRef}
								value={newColumnTitle}
								onChange={onNewColumnTitleChange}
								onKeyDown={(e) => e.key === "Enter" && addNewColumn()}
							/>
							<Button variant="success" size="sm" onClick={addNewColumn}>
								Add column
							</Button>
							<span
								className="cancel-new-column"
								onClick={toggleOpenNewColumnForm}
							>
								<i className="fa fa-trash icon"></i>
							</span>
						</Col>
					</Row>
				)}
			</BootstrapContainer>
		</div>
	);
}

export default BoardContent;
