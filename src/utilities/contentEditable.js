/**
 * editable content
 */

// on keydown === Enter
export const saveContentAfterPressEnter = (e) => {
	if (e.key === "Enter") {
    e.preventDefault();
		e.target.blur();
	}
};

// Select all input text when click
export const selectAllInlineText = (e) => {
	e.target.focus();
	e.target.select();
};
