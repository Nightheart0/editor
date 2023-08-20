import $ from 'jquery';
import * as ML from 'mathlive';

import { newMathField } from './math-field';
import { init as initToolbars } from './toolbars';
import { locales } from './locales';
import * as clipboard from './clipboard';

import toolbarStyles from './toolbars.module.css';

/**
 * The initial state
 */
const initialState: EditorState = {
	focus: {
		richTextEditor: false,
		mathEquation: false,
	},

	$currentEditor: null,
	$toolbar: null,
	$helpOverlay: null,

	firstCall: true,
};

const defaultOptions: EditorOptions = {
	locale: 'en',
};

window.editor2 = window.editor2 || initialState;
const state = window.editor2;

function init(div: HTMLDivElement, options: EditorOptions) {
	const strings = locales[options.locale ?? defaultOptions.locale as EditorSupportedLocale];

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
		})
		.on('paste', (e) => {
			clipboard.onPaste($(div) as JQuery<HTMLDivElement>, e);
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
