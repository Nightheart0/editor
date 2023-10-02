import $ from 'jquery';

import { SunstarEditorElement } from "@/editor-element";

import toolbarStyles from '../toolbars.module.css';

function initCore(editor: SunstarEditorElement, editorDiv: HTMLDivElement) {
	editorDiv.addEventListener('focus', (ev) => onFocus(editorDiv, ev));
	editorDiv.addEventListener('blur', (ev) => onBlur(editorDiv, ev));

	editorDiv.addEventListener('keydown', (ev) => {

	});

	editorDiv.addEventListener('input', (ev) => {

	});

	editorDiv.addEventListener('copy', (ev) => {

	});

	editorDiv.addEventListener('paste', (ev) => {

	});
}

function onFocus(editorDiv: HTMLDivElement, ev: FocusEvent) {
	let state = window.sunstar.editorState;
	state.$currentEditor = $(editorDiv);

	toggleToolbarAnimation();
	toggleToolbar(true);
}

function onBlur(editorDiv: HTMLDivElement, ev: FocusEvent) {
	let state = window.sunstar.editorState;

	if (state.$currentEditor?.get(0) === editorDiv) {
		state.$currentEditor = null;
	}

	toggleToolbar(false);
	toggleToolbarAnimation();
}

function toggleToolbar(isVisible: boolean) {
	$('body').toggleClass(toolbarStyles['rich-text-editor-focus'], isVisible);
}

function toggleToolbarAnimation() {
	let state = window.sunstar.editorState;
	const animatingClass = toolbarStyles['tools--animating'];

	if (state.$toolbar === null) return;

	state.$toolbar
		.addClass(animatingClass)
		.one('transitionend transitioncancel', () => state.$toolbar!.removeClass(animatingClass));
}

export { initCore };
