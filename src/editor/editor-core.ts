import $ from 'jquery';

import { SunstarEditorElement } from "@/editor-element";
import * as richText from '@/editor/rich-text';
import * as mathField from '@/editor/math-field';
import * as utils from '@/utils/utils';
import * as clipboard from '@/utils/clipboard';

import toolbarStyles from '@/toolbar/toolbars.module.css';

function initCore(editor: SunstarEditorElement, editorDiv: HTMLDivElement) {
	const shadow = editor.shadowRoot as ShadowRoot; // The shadow root will 100% sure exist by this point

	editorDiv.addEventListener('focus', (ev) => onFocus(editorDiv, ev));
	editorDiv.addEventListener('blur', (ev) => onBlur(editorDiv, ev));

	editorDiv.addEventListener('keydown', (ev) => {
		if (ev.ctrlKey) {
			switch (ev.code) {
				case 'KeyE':
					ev.preventDefault();

					// @ts-ignore - Chromium-specific way of getting the selection in a shadow root
					if (shadow.getSelection) {
						// @ts-ignore
						mathField.newMathField($(editorDiv), shadow.getSelection());
					} else {
						mathField.newMathField($(editorDiv));
					}

					break;
				case 'KeyB':
					ev.preventDefault();
					richText.toggleBold();

					break;
				case 'KeyI':
					ev.preventDefault();
					richText.toggleItalic();

					break;
				case 'KeyU':
					ev.preventDefault();
					richText.toggleUnderline();

					break;
				case 'KeyD':
					ev.preventDefault();
					richText.toggleStrikethrough();

					break;
				case 'Comma':
					ev.preventDefault();
					richText.toggleSubscript();

					break;
				case 'Period':
					ev.preventDefault();
					richText.toggleSuperscript();

					break;
				default:
					// Do nothing
			}
		}

		if (ev.code === 'Enter') {
			ev.preventDefault();
			richText.insertLinebreak();
		}
	});

	editorDiv.addEventListener('input', (ev) => {
		if (editorDiv.lastChild === null) createInitialParagraph(editorDiv);
		//onDivInput();
	});

	editorDiv.addEventListener('copy', (ev) => clipboard.onCopy($(editorDiv), ev));
	editorDiv.addEventListener('paste', (ev) => clipboard.onPaste($(editorDiv) as JQuery<HTMLDivElement>, ev));

	createInitialParagraph(editorDiv);
	editorDiv.contentEditable = 'true';
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

function createInitialParagraph(div: HTMLDivElement) {
	const textNode = document.createTextNode(new DOMParser().parseFromString('&ZeroWidthSpace;', 'text/html').documentElement.textContent as string);
	const paragraph = utils.createParagraph(textNode);

	div.appendChild(paragraph);

	const selection = document.getSelection();
	if (!selection) return;

	try {
		const range = selection.getRangeAt(0);
		range.selectNode(textNode);
	} catch {
		console.log('Couldn\'t select node.');
	}
}

export { initCore };
