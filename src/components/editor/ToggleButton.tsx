import React from "react";

interface ToggleButtonProps {
	/*
	* The option represented by the button,
	* which will be used for building a title
	* and a lowercased data-cy attribute for usage with cypress
	* (In data-cy Bold would be "bold-button")
	*
	* @example "Bold"
	*/
	title: string;

	/*
	* The shortcut which mimics the button's behaviour
	*/
	shortcut?: string;

	/*
	* Whether the button is currently selected
	*/
	isSelected?: boolean;

	/*
	* The onClick handler for the button
	*/
	onClick: React.MouseEventHandler<HTMLButtonElement>;

	children: React.ReactNode;
};

/*
* Acts as an wrapper of the native button component with the addition
* that it can hold a selected state. Since this component is meant to
* represent options with states in a toolbar, it also can take a title
* and shortcut parameters which are used to build a title to the button.
*/
function ToggleButton({ isSelected, onClick, title, shortcut, children }: ToggleButtonProps) {
	return (
		<div className="relative inline-block h-full">
			<button
				data-cy={`${title.toLocaleLowerCase()}-button`}
				onClick={onClick}
				aria-selected={isSelected ?? false}
				title={title + `${shortcut ? ` (${shortcut})` : ''}`}
				className={`
					bg-transparent aria-selected:bg-accent hover:bg-accent
					text-secondary-foreground aria-selected:text-foreground 
					hover:text-foreground px-4 py-2 h-full rounded
				`} 
			>
				{children}
			</button>
		</div>
	);
}

export default ToggleButton;
