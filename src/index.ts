import * as rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';

import { SunstarEditorElement } from './editor-element';
import { isBrowser } from './utils/supported-features';
import * as version from './version';
import { init } from './editor';

interface Sunstar {
	editorState: {};

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

	if (!window.sunstar.editorVersion) window.sunstar.editorVersion = version.VERSION_STRING;
	if (!window.sunstar.editorVersionMajor) window.sunstar.editorVersionMajor = version.VERSION_MAJOR;
	if (!window.sunstar.editorVersionMinor) window.sunstar.editorVersionMinor = version.VERSION_MINOR;
	if (!window.sunstar.editorVersionPatch) window.sunstar.editorVersionPatch = version.VERSION_PATCH;

	if (!window.sunstar.SunstarEditorElement) window.sunstar.SunstarEditorElement = SunstarEditorElement;
	if (window.customElements && !window.customElements.get('math-field')) {
		customElements.define('sunstar-editor', SunstarEditorElement);
	}

	(window as any).initSunstarEditor = init;
}
