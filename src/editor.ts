import $ from 'jquery';
import * as ML from 'mathlive';

import { newMathField } from './math-field';
import { locales } from './locales';

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
}

export { init };
