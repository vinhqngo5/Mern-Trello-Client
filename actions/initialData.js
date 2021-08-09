export const initialData = {
	boards: [
		{
			id: "board-1",
			columnOrder: ["column-1", "column-2", "column-3"],
			columns: [
				{
					id: "column-1",
					boardId: "board-1",
					title: "To do Column",
					cardOrder: ["card-1", "card-2", "card-3"],
					cards: [
						{
							id: "card-1",
							boardId: "board-1",
							columnId: "column-1",
							title: "Title of card 1",
							cover: null,
						},
					],
				},
			],
		},
	],
};
