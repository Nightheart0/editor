import $ from 'jquery';
import * as rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';

import { SunstarEditorElement } from './editor-element';
import { init } from './editor';
import { init as initToolbars } from './toolbars';
import { init as initHelpDialog } from './help-dialog';
import { isBrowser } from './utils/supported-features';
import * as version from './version';

import textStyles from './text-styles.module.css';

interface EditorState {
	focus: {
		textEditor: boolean;
		mathField: boolean;
	};

	styleAppliers: {
		bold: any;
		italic: any;
		underline: any;
		strikethrough: any;
		subscript: any;
		superscript: any;
	};

	$currentEditor: JQuery<HTMLDivElement> | null;
	$toolbar: JQuery<HTMLDivElement>;
	$helpDialog: JQuery<HTMLDialogElement>;
};

interface Sunstar {
	editorState: EditorState;

	editorVersion: string;
	editorVersionMajor: number;
	editorVersionMinor: number;
	editorVersionPatch: number;

	SunstarEditorElement: typeof SunstarEditorElement;

	[index: string]: any;
}

declare global {
	interface Window {
		sunstar: Sunstar;
	}
}

if (isBrowser()) {
	(rangy as any).init();

	if (!window.sunstar) {
		// @ts-ignore
		window.sunstar = {};
	}

	// Set the editor version
	if (!window.sunstar.editorVersion) window.sunstar.editorVersion = version.VERSION_STRING;
	if (!window.sunstar.editorVersionMajor) window.sunstar.editorVersionMajor = version.VERSION_MAJOR;
	if (!window.sunstar.editorVersionMinor) window.sunstar.editorVersionMinor = version.VERSION_MINOR;
	if (!window.sunstar.editorVersionPatch) window.sunstar.editorVersionPatch = version.VERSION_PATCH;

	// Initialize the editor state
	if (!window.sunstar.editorState) window.sunstar.editorState = {
		focus: {
			textEditor: false,
			mathField: false,
		},
	
		styleAppliers: {
			bold: (rangy as any).createClassApplier(textStyles.bold),
			italic: (rangy as any).createClassApplier(textStyles.italic),
			underline: (rangy as any).createClassApplier(textStyles.underline),
			strikethrough: (rangy as any).createClassApplier(textStyles.strikethrough),
			subscript: (rangy as any).createClassApplier(textStyles.subscript),
			superscript: (rangy as any).createClassApplier(textStyles.superscript),
		},
	
		$currentEditor: null,
		$toolbar: initToolbars() as JQuery<HTMLDivElement>,
		$helpDialog: initHelpDialog() as JQuery<HTMLDialogElement>,
	};

	// Append the toolbar and help dialog to the body of the page
	$('body').append(window.sunstar.editorState.$toolbar);
	$('body').append(window.sunstar.editorState.$helpDialog);

	// Define the `<sunstar-editor>` custom element
	if (!window.sunstar.SunstarEditorElement) window.sunstar.SunstarEditorElement = SunstarEditorElement;
	if (window.customElements && !window.customElements.get('math-field')) {
		customElements.define('sunstar-editor', SunstarEditorElement);
	}
}
