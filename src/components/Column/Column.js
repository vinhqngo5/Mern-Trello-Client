import React, { useState, useEffect } from "react";
import "./Column.scss";
import Card from "components/Card/Card";
import { mapOrder } from "utilities/sort";
import { Container, Draggable } from "react-smooth-dnd";
import { Dropdown, Form, Button } from "react-bootstrap";
import ConfirmModal from "components/Common/ConfirmModal";
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from "utilities/constants";
import {
	saveContentAfterPressEnter,
	selectAllInlineText,
} from "utilities/contentEditable";
import { useRef } from "react";
import { cloneDeep } from "lodash";

function Column(props) {
	const { column, onCardDrop, onUpdateColumn, onAddNewCartToColumn } = props;
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [columnTitle, setColumnTitle] = useState("");
	const [newCardTitle, setNewCardTitle] = useState("");

	const cards = mapOrder(column.cards, column.cardOrder, "id");

	const [openNewCardForm, setOpenNewCardForm] = useState(false);

	const newCardTextareaRef = useRef(null);
	const toggleOpenNewCardForm = () => {
		setOpenNewCardForm(!openNewCardForm);
	};

	useEffect(() => {
		setColumnTitle(column.title);
	}, [column.title]);

	useEffect(() => {
		// effect
		if (newCardTextareaRef && newCardTextareaRef.current) {
			newCardTextareaRef.current.focus();
			// highlight the title in input
			newCardTextareaRef.current.select();
		}
		return () => {
			// cleanup
		};
	}, [openNewCardForm]);

	const onNewCardTitleChange = (e) => {
		setNewCardTitle(e.target.value);
	};

	const addNewCard = () => {
		if (!newCardTitle) {
			newCardTextareaRef.current.focus();
			return;
		}
		const newCardToAdd = {
			// random 5 characters, will remove when use mongodb
			id: Math.random().toString(36).substr(2, 5),
			boardId: column.boardId,
			columnId: column.id,
			title: newCardTitle.trim(),
			cover: null,
		};

		let newColumn = cloneDeep(column);
		newColumn.cards.push(newCardToAdd);
		newColumn.cardOrder.push(newCardToAdd.id);

		onAddNewCartToColumn(newColumn);
		setNewCardTitle("");
		toggleOpenNewCardForm();
	};

	const onConfirmModalAction = (type) => {
		console.log(type);
		switch (type) {
			case MODAL_ACTION_CLOSE:
				// just close then do nothing
				break;
			case MODAL_ACTION_CONFIRM:
				const newColumn = {
					...column,
					_destroy: true,
				};
				onUpdateColumn(newColumn);
				// remove column
				break;
			default:
		}
		toggleShowConfirmModal();
	};

	const toggleShowConfirmModal = () => {
		setShowConfirmModal(!showConfirmModal);
	};

	const handleColumnTitleChange = (e) => {
		setColumnTitle(e.target.value);
	};

	const handleColumnTitleBlur = () => {
		const newColumn = {
			...column,
			title: columnTitle,
		};
		onUpdateColumn(newColumn);
	};

	return (
		<div className="column">
			<header className="column-drag-handle">
				<div className="column-title">
					<Form.Control
						size="sm"
						type="text"
						className="trello-content-editable"
						value={columnTitle}
						onChange={handleColumnTitleChange}
						onBlur={handleColumnTitleBlur}
						spellCheck="false"
						onClick={selectAllInlineText}
						onMouseDown={(e) => e.preventDefault()}
						onKeyDown={saveContentAfterPressEnter}
					/>
				</div>
				<div className="column-dropdown-actions">
					<Dropdown>
						<Dropdown.Toggle
							id="dropdown-basic"
							size="sm"
							className="dropdown-btn"
						/>

						<Dropdown.Menu>
							<Dropdown.Item>Add card...</Dropdown.Item>
							<Dropdown.Item onClick={toggleShowConfirmModal}>
								Remove Column...
							</Dropdown.Item>
							<Dropdown.Item>
								Move all cards in this column (beta)...
							</Dropdown.Item>
							<Dropdown.Item>
								Arrchive all cards in this column (beta)...
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</header>
			<div className="card-list">
				<Container
					// onDragStart={(e) => console.log("drag started", e)}
					// onDragEnd={(e) => console.log("drag end", e)}
					// onDragEnter={() => {
					// 	console.log("drag enter:", column.id);
					// }}
					// onDragLeave={() => {
					// 	console.log("drag leave:", column.id);
					// }}
					// onDropReady={(p) => console.log("Drop ready: ", p)}
					style={{ minHeight: "10px" }}
					groupName="col"
					onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
					getChildPayload={(index) => {
						return cards[index];
					}}
					dragClass="card-ghost"
					dropClass="card-ghost-drop"
					dropPlaceholder={{
						animationDuration: 150,
						showOnTop: true,
						className: "card-drop-preview",
					}}
					dropPlaceholderAnimationDuration={200}
				>
					{cards.map((card, index) => {
						return (
							<Draggable key={index}>
								<Card card={card} />
							</Draggable>
						);
					})}
				</Container>
				{openNewCardForm && (
					<div className="add-new-card-area">
						<Form.Control
							size="sm"
							as="textarea"
							row="3"
							placeholder="Enter a title for this card.."
							className="textarea-enter-new-card"
							ref={newCardTextareaRef}
							value={newCardTitle}
							onChange={onNewCardTitleChange}
							// onKeyDown={(e) => e.key === "Enter" && addNewCard()}
						/>
					</div>
				)}
			</div>

			<footer>
				{openNewCardForm && (
					<div className="add-new-card-actions">
						<Button onClick={addNewCard} variant="success" size="sm">
							Add column
						</Button>
						<span className="cancel-icon" onClick={toggleOpenNewCardForm}>
							<i className="fa fa-trash icon"></i>
						</span>
					</div>
				)}
				{!openNewCardForm && (
					<div className="footer-actions" onClick={toggleOpenNewCardForm}>
						<i className="fa fa-plus icon" />
						&nbsp;Add another card
					</div>
				)}
			</footer>
			<ConfirmModal
				show={showConfirmModal}
				onAction={onConfirmModalAction}
				title="Remove column"
				content={`Are you sure to remove <strong>${column.title}</strong>! <br>All related cards will also be removed`}
			/>
		</div>
	);
}

export default Column;
