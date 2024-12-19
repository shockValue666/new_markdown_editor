'use client'

/*
* This module re-exports and configures extensions of the Tiptap
* editor. These extensions may define functionality (History for
* undo/redo), inline content (bold, italic) or block content 
* (paragraphs, blockquotes, lists, etc). Most of the extensions
* are configured to match the application styles by adding tailwind
* classes to their configuration.
* 
* @see {@link https://tiptap.dev/api/extensions}
*/

import { Document as Document_ } from '@tiptap/extension-document';
import { Heading as Heading_ } from '@tiptap/extension-heading';
import { Paragraph as Paragraph_ } from '@tiptap/extension-paragraph';
import { Blockquote as Blockquote_ } from '@tiptap/extension-blockquote';
import { Text as Text_ } from '@tiptap/extension-text';
import { BulletList as BulletList_ } from '@tiptap/extension-bullet-list';
import { OrderedList as OrderedList_ } from '@tiptap/extension-ordered-list';
import { ListItem as ListItem_ } from '@tiptap/extension-list-item';
import { CodeBlock as CodeBlock_ } from '@tiptap/extension-code-block';
import { Bold as Bold_ } from '@tiptap/extension-bold';
import { Italic as Italic_ } from '@tiptap/extension-italic';
import { Code as Code_ } from '@tiptap/extension-code';
import { History as History_ } from '@tiptap/extension-history';
import { Markdown as Markdown_ } from 'tiptap-markdown';
import { mergeAttributes } from '@tiptap/core';

export const Document = Document_;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    markdown: {
      saveMarkdown: () => boolean,
    }
  }
}

/*
* Adds a keyboard shortcut which uses a callback to handle
* the resulting markdown
*/
export const Markdown = (onSave: (markdown: string) => boolean) => {
	return Markdown_.extend({
		addCommands() {
			return {
				saveMarkdown: () => {
					const { markdown } = this.editor.storage;
					return onSave(markdown.getMarkdown);
				},
			}
		},
		addKeyboardShortcuts() {
			return {
				'Mod-s': () => {
					return this.editor.commands.saveMarkdown();
				}
			}
		}
	});
}

/*
* Represents a mapping from a heading 
* level to its respective classes
*/
interface HeadingClasses {
	[level: number]: string;
};

export const Heading = Heading_.extend({
	levels: [1, 2, 3],

	renderHTML({ node, HTMLAttributes }) {
		const level = this.options.levels.includes(node.attrs.level)
			? node.attrs.level
			: this.options.levels[0];

		const className = ({
			1: 'mt-6 scroll-m-20 text-4xl font-extrabold tracking-tight first:mt-0',
			2: 'mt-6 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
			3: 'mt-6 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0',
		} as HeadingClasses)[level];

		return [
			`h${level}`,
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: className,
			}),
			0,
		];
	}
});

export const Paragraph = Paragraph_.configure({
	HTMLAttributes: {
		class: 'leading-7 [&:not(:first-child)]:mt-3',
	},
});

export const BulletList = BulletList_.configure({
	HTMLAttributes: {
		class: 'first:mt-0 my-6 ml-6 list-disc [&>li]:mt-2',
	},
});

export const OrderedList = OrderedList_.configure({
	HTMLAttributes: {
		class: 'first:mt-0 my-6 ml-6 list-decimal [&>li]:mt-2',
	},
});

export const ListItem = ListItem_;

export const Blockquote = Blockquote_.configure({
	HTMLAttributes: {
		class: 'first:mt-0 mt-6 border-l-2 pl-6 italic',
	},
});

export const CodeBlock = CodeBlock_.configure({
	HTMLAttributes: {
		class: 'first:mt-0 my-6 overflow-x-auto rounded-lg p-4 bg-zinc-900 text-zinc-100',
	},
});

export const Bold = Bold_;
export const Italic = Italic_;

export const Code = Code_.configure({
	HTMLAttributes: {
		class: 'bg-zinc-900 text-zinc-100 rounded px-1 py-0.5 mx-1 text-sm',
	},
});

export const History = History_;
export const Text = Text_;
