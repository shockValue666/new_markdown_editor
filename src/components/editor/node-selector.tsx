import { ReactElement, useState } from "react";

import { 
	Button,
	DropdownMenu, 
	DropdownMenuContent, 
	DropdownMenuRadioGroup, 
	DropdownMenuRadioItem, 
	DropdownMenuTrigger 
} from "./ui";

import { ChevronDownIcon } from "lucide-react";

/*
* Represents arguments to EditorFacade methods
*/
interface SelectedData {
	/* 
	* The name of the node
	* @example "heading"
	*/
	name: string;
	/*
	* An Object containing the attributes of the node,
	* if it contains any
	* @example { level: 1 }
	*/
	attrs?: Object;
}

/*
* Defines a subset of editor methods that the
* component relies on
*/
interface EditorFacade {
	/*
	* Checks if a node matching given parameters is active
	* @returns {boolean} True if active, otherwise false
	*/
	isActive: (name: string, attrs?: Object) => boolean;


	/*
	* Sets the currently selected node to another node
	* matching the given parameters
	*/
	setNode: (name: string, attrs?: Object) => boolean;
}

/*
* Props for the NodeOption component
*/
interface NodeOptionProps {
	/*
	* The label of the option
	* @example "Heading 1"
	*/
	label: string;

	/*
	* An icon which should be
	* rendered on the left of the label
	*/
	labelIcon?: React.ReactNode;

	/*
	* Data specifying a node it represents
	*/
	data: SelectedData;
}

/*
* Props for the NodeSelector component
*/
interface NodeSelectorProps {
	/*
	* Provides an interface to editor methods
	* which {@link NodeSelector} relies on
	*/
	editor: EditorFacade;

	/*
	* A list of NodeOption elements
	*/
	children: ReactElement<NodeOptionProps>[];
};

/*
* Represents an option of NodeSelector, and should only
* used as it's child.
*/
export function NodeOption({ label, labelIcon }: NodeOptionProps) {
	return (
		<DropdownMenuRadioItem data-cy={label} value={label}>
			<div className="flex items-center gap-3">
				{labelIcon}
				<span>{label}</span>
			</div>
		</DropdownMenuRadioItem>
	);
}

/*
* Provides an dropdown interface, similar to Word or Google Docs,
* for picking different text types, such as headings, paragraphs,
* code blocks, etc. This should only be used to select nodes whose
* content is inline, unlike lists or blockquotes.
* 
* If none of the node which the supplied options represent are active,
* or the editor has a selection which spans multiple node types, the
* selector then acts as the one in Docs does and enters a disabled state
* in which the dropdown trigger has no text and is disabled.
*
* @see {@link NodeOption}
*
* @example 
* <NodeSelector editor={{
*	isActive: (node, attrs) => editor.isActive(node, attrs),
*   setNode: (node, attrs) => editor.chain().focus().setNode(node, attrs).run()
* }}>
** 	<NodeOption 
* 		label="Paragraph" 
* 		labelIcon={<ParagraphIcon />} 
* 		data={{ name: "paragraph" }} />
* 	<NodeOption 
* 		label="Heading 1" 
* 		labelIcon={<Heading1Icon />} 
* 		data={{ name: "heading", attrs: { level: 1 } }} />
* </NodeSelector>
*/
export function NodeSelector({ children, editor }: NodeSelectorProps) {
	const [open, setOpen] = useState(false);

	const nodes = new Map(children.map(({ key, props }) => [key ?? props.label, props.data]));

	function getActiveNode(): string | null {
		for (const [name, data] of nodes) {
			if (editor.isActive(data.name, data.attrs)) {
				return name;
			}
		}

		return null;
	}

	function onValueChange(value: string) {
		const data = nodes.get(value);
		if (!data) throw new Error('undefined node selected');
		editor.setNode(data.name, data.attrs);
	}

	const selected = getActiveNode();
	const selectedOption = children.find(({ props }) => props.label === selected);

	return (
		<DropdownMenu open={open}  onOpenChange={setOpen}>
			<DropdownMenuTrigger disabled={!selected} data-cy="dropdown-trigger" asChild>
				<Button variant="ghost">
					{ selected ?
						<div className="w-24 flex items-center gap-3">
							{selectedOption?.props.labelIcon}
							{selectedOption?.props.label}
						</div> :
						<div className="w-24 opacity-0">
							Hidden
						</div>
					}
					{open ? 
						<ChevronDownIcon className="ml-3 rotate-180" /> : 
						<ChevronDownIcon className="ml-3" />
					}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent onCloseAutoFocus={e => e.preventDefault() } className="w-fit">
				<DropdownMenuRadioGroup value={selected ?? ''} onValueChange={onValueChange}>
					{children}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
