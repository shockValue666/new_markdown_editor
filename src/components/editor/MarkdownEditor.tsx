import { BoldIcon, CodeIcon, CodeSquareIcon, Heading1Icon, Heading2Icon, Heading3Icon, ItalicIcon, ListIcon, ListOrderedIcon, RedoIcon, SaveIcon, TextIcon, TextQuoteIcon, UndoIcon } from 'lucide-react';
import { Document, Text, History, Blockquote, Bold, BulletList, Code, CodeBlock, Heading, Italic, ListItem, OrderedList, Paragraph, Markdown } from './extensions';

import { EditorContent, useEditor } from '@tiptap/react';

import ToggleButton from './ToggleButton';
import { NodeOption, NodeSelector } from './node-selector';

import { Button } from './ui';
import React from 'react';

interface MarkdownEditorProps {
	/* 
	* Size of toolbar icons in px
	*/
	iconsSize?: number

	/*
	* Initial markdown content to be
	* parsed and rendered by the editor
	*/
	initialContent: string

	/*
	* Callback to be called when user
	* saves the document, which can
	* process the resulting markdown
	*/
	onSave: (markdown: string) => boolean
}

/*
* A WYSIWYG UI interface for editing markdown content,
* based on the Tiptap editor
*/
function MarkdownEditor({ initialContent, onSave, iconsSize = 18 }: MarkdownEditorProps) {
	if (typeof window === "undefined") {
		return null;
	}

	const editor = useEditor({
		content: initialContent,
		immediatelyRender: false,
		extensions: [
			Document,
			Markdown(onSave),
			Heading,
			Paragraph,
			Blockquote,
			Text,
			BulletList,
			OrderedList,
			ListItem,
			CodeBlock,
			Bold,
			Italic,
			Code,
			History,
		],
		editorProps: {
			attributes: {
				class: "[&>div:first-child]:h-full [&>div:first-child>div:first-child]:h-full",
			},
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="w-full h-full flex flex-col min-h-96 bg-background text-foreground text-opacity-60">
			<div data-cy="editor-menu" className="overflow-x-scroll w-full min-h-12 px-2 py-1 top-0 flex items-center border-b-border border-b gap-3 z-10 bg-background">
				<NodeSelector editor={{
					isActive: (node, attrs) => editor.isActive(node, attrs),
					setNode: (node, attrs) => editor.chain().focus().setNode(node, attrs).run(),
				}}>
					<NodeOption 
						label="Paragraph" 
						labelIcon={<TextIcon size={iconsSize}/>}
						data={{ name: 'paragraph', attrs: {} }}
					/>
					<NodeOption 
						label="Code Block"
						labelIcon={<CodeSquareIcon size={iconsSize}/>}
						data={{ name: 'codeBlock', attrs: {} }}
					/>
					<NodeOption 
						label="Heading 1" 
						labelIcon={<Heading1Icon size={iconsSize}/>}
						data={{ name: 'heading', attrs: { level: 1 } }}
					/>
					<NodeOption 
						label="Heading 2" 
						labelIcon={<Heading2Icon size={iconsSize}/>}
						data={{ name: 'heading', attrs: { level: 2 } }}
					/>
					<NodeOption 
						label="Heading 3" 
						labelIcon={<Heading3Icon size={iconsSize}/>}
						data={{ name: 'heading', attrs: { level: 3 } }}
					/>
				</NodeSelector>
				<div className="w-1 h-7 bg-transparent border-r-border border-r" />
				{/*	
					All of the shortcuts informed below are Tiptap's defaults for the given action 
					and are passed to ToggleButton only to create a label for the user. Read the
					component comments for more information.

					See "https://tiptap.dev/docs/editor/core-concepts/keyboard-shortcuts#predefined-keyboard-shortcuts" 
					for a list of all of Tiptap default shortcuts.
				*/}
				<ToggleButton 
					title="Bold"
					shortcut="Ctrl+B"
					isSelected={editor.isActive("bold")} 
					onClick={() => editor.chain().focus().toggleBold().run()}>
					<BoldIcon size={iconsSize}/>
				</ToggleButton>
				<ToggleButton
					title="Italic"
					shortcut="Ctrl+I"
					isSelected={editor.isActive("italic")} 
					onClick={() => editor.chain().focus().toggleItalic().run()}>
					<ItalicIcon size={iconsSize}/>
				</ToggleButton>
				<ToggleButton
					title="Code"
					shortcut="Ctrl+E"
					isSelected={editor.isActive("code")} 
					onClick={() => editor.chain().focus().toggleCode().run()}>
					<CodeIcon size={iconsSize}/>
				</ToggleButton>
				<div className="w-1 h-7 bg-transparent border-r-border border-r" />
				<ToggleButton
					title="Blockquote"
					shortcut="Ctrl+Shift+B"
					isSelected={editor.isActive("blockquote")} 
					onClick={() => editor.chain().focus().toggleBlockquote().run()}>
					<TextQuoteIcon size={iconsSize}/>
				</ToggleButton>
				<ToggleButton
					title="Bullet List"
					shortcut="Ctrl+Shift+8"
					isSelected={editor.isActive("bulletList")} 
					onClick={() => editor.chain().focus().toggleBulletList().run()}>
					<ListIcon size={iconsSize}/>
				</ToggleButton>
				<ToggleButton
					title="Ordered List"
					shortcut="Ctrl+Shift+7"
					isSelected={editor.isActive("bulletList")} 
					onClick={() => editor.chain().focus().toggleBulletList().run()}>
					<ListOrderedIcon size={iconsSize}/>
				</ToggleButton>
				<div className="w-1 h-7 bg-transparent border-r-border border-r" />
				<Button
					title="Undo (Ctrl+U)"
					variant="ghost"
					type="button"
					onClick={() => editor.chain().focus().undo().run()}
				>
					<UndoIcon size={iconsSize}/>
				</Button>
				<Button
					title="Redo (Ctrl+R)"
					variant="ghost"
					type="button"
					onClick={() => editor.chain().focus().redo().run()}
				>
					<RedoIcon size={iconsSize}/>
				</Button>
				<Button
					title="Save (Ctrl+S)"
					variant="ghost"
					type="button"
					onClick={() => editor.commands.saveMarkdown()}
				>
					<SaveIcon size={iconsSize}/>
				</Button>
			</div>
			{/* <EditorContent 
				spellCheck={false} 
				className="h-full border border-yellow-500 p-6 " 
				editor={editor} 
			/> */}
			<div className="flex-grow overflow-y-auto relative">
				<EditorContent 
				spellCheck={false} 
				className="h-full min-h-[400px] p-6 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2" 
				editor={editor} 
				/>
			</div>

		</div>
	);
}

export default MarkdownEditor;
