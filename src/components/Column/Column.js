import React, { useState } from "react";
import "./Column.scss";
import Card from "components/Card/Card";
import { mapOrder } from "utilities/sort";
import { Container, Draggable } from "react-smooth-dnd";
import { Dropdown, DropdownButton } from "react-bootstrap";
import ConfirmModal from "components/Common/ConfirmModal";
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from "utilities/constants";

function Column(props) {
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const { column, onCardDrop } = props;

	const cards = mapOrder(column.cards, column.cardOrder, "id");

	const onConfirmModalAction = (type) => {
		console.log(type);
		switch (type) {
			case MODAL_ACTION_CLOSE:
				// just close then do nothing
				break;
			case MODAL_ACTION_CONFIRM:
				// remove column
				break;
			default:
		}
		toggleShowConfirmModal();
	};

	const toggleShowConfirmModal = () => {
		setShowConfirmModal(!showConfirmModal);
	};
	return (
		<div className="column">
			<header className="column-drag-handle">
				<div className="column-title">{column.title}</div>
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
			</div>
			<footer>
				<div className="footer-actions">
					<i className="fa fa-plus icon" />
					&nbsp;Add another card
				</div>
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
