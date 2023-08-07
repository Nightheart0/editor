import $ from 'jquery';
import * as ML from 'mathlive';

import { newMathField } from './math-field';
import { init as initToolbars } from './toolbars';
import { locales } from './locales';

import toolbarStyles from './toolbars.module.css';

/**
 * The initial state
 */
const initialState: MistyEditorState = {
	focus: {
		richTextEditor: false,
		mathEquation: false,
	},

	$currentEditor: null,
	$toolbar: null,
	$helpOverlay: null,

	firstCall: true,
};

const defaultOptions: MistyEditorOptions = {
	locale: 'en',
};

window.mistyEditor = window.mistyEditor || initialState;
const state = window.mistyEditor;

function init(div: HTMLDivElement, options: MistyEditorOptions) {
	const strings = locales[options.locale ?? defaultOptions.locale as MistyEditorSupportedLocale];

	if (state.firstCall) {
		state.firstCall = false;
		state.$toolbar = initToolbars() as JQuery<HTMLDivElement>;
		$('body').append(state.$toolbar);
	}

	$(div)
		.attr({
			contenteditable: true,
			spellcheck: false,
			'data-js': 'mistyeditor',
		})
		.addClass('rich-text-editor')
		.on('keydown', (e) => {
			if (e.ctrlKey && e.code === 'KeyE') {
				e.preventDefault();

				newMathField($(div));
			}
		})
		.on('focus', (e) => {
			onFocus($(div));
		})
		.on('blur', (e) => {
			onBlur($(div));
		});
}

function onFocus($editorElement: JQuery<HTMLDivElement>) {
	state.$currentEditor = $editorElement;
	toggleRichTextToolbarAnimation();
	toggleRichTextToolbar(true, state.$currentEditor);
}

function onBlur($editorElement: JQuery<HTMLDivElement>) {
    toggleRichTextToolbar(false, $editorElement)
    toggleRichTextToolbarAnimation()
    //focus.richText = false
}

function toggleRichTextToolbar(isVisible: boolean, $editor: JQuery<HTMLDivElement>) {
	$('body').toggleClass(toolbarStyles['rich-text-editor-focus'], isVisible);
	$editor.toggleClass('rich-text-focused', isVisible);
}

function toggleRichTextToolbarAnimation() {
	const animatingClass = toolbarStyles['tools--animating'];

	if (state.$toolbar === null) return;

	state.$toolbar
		.addClass(animatingClass)
		.one('transitionend transitioncancel', () => state.$toolbar!.removeClass(animatingClass));
}

export { init };
