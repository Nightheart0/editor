import $ from 'jquery';
import * as ML from 'mathlive';

import * as utils from './utils';

import styles from './editor.module.css';

function newMathField($editorDiv: JQuery<HTMLDivElement>) {
	const span = document.createElement('span');
	const mfe = new ML.MathfieldElement();

	initializeSpan(span);
	addMathFieldEventListeners($editorDiv, span, mfe);

	//span.appendChild(document.createTextNode(new DOMParser().parseFromString('&nbsp;', 'text/html').documentElement.textContent as string));
	span.appendChild(mfe);
	initializeLaTeXEditor(span, mfe);
	//span.appendChild(document.createTextNode(new DOMParser().parseFromString('&nbsp;', 'text/html').documentElement.textContent as string));

	utils.insertAtCursor(span);
	setTimeout(() => mfe.focus(), 0);
}

function initializeSpan(span: HTMLSpanElement) {
	span.contentEditable = 'false';
	span.dataset.mathfield = 'true';

	span.classList.add(styles['math-field']);
	span.classList.add(styles['math-field-closed']);
}

function initializeLaTeXEditor(span: HTMLSpanElement, mfe: ML.MathfieldElement) {
	const textarea = document.createElement('textarea');

	textarea.placeholder = 'LaTeX';

	mfe.addEventListener('input', (ev) => textarea.value = mfe.value);

	textarea.addEventListener('input', (ev) => mfe.setValue(textarea.value, { silenceNotifications: true }));
	textarea.addEventListener('blur', (ev) => {
		if (ev.relatedTarget === undefined) return;
		if (ev.relatedTarget === mfe) return;

		onBlur(mfe, span, ev);
	});
	textarea.value = mfe.value;

	span.appendChild(textarea);
}

function addMathFieldEventListeners($editorDiv: JQuery<HTMLDivElement>, span: HTMLSpanElement, mfe: ML.MathfieldElement) {
	mfe.mathModeSpace = '\\:';

	mfe.addEventListener('click', (e) => {
		if (mfe.readOnly === true) {
			mfe.readOnly = false;
			setTimeout(() => mfe.focus(), 0);
		}
	});
	mfe.addEventListener('keydown', (e) => {
		if (e.code === 'Escape') {
			e.preventDefault();
			e.stopPropagation();

			mfe.readOnly = true;

			$editorDiv.get(0)!.focus();

			const selection = window.getSelection();
			if (selection === null) return;

			const range = selection.getRangeAt(0);
			range.setStartAfter(span);
			range.setEndAfter(span);

			const value = mfe.value;
			if (value.endsWith('\\')) mfe.setValue(value.slice(0, -1), { silenceNotifications: true });

			if (mfe.value === '') $(mfe).parent().remove();
		}
	});
	mfe.addEventListener('beforeinput', (e) => {
		if (e.inputType === 'insertLineBreak') {
			e.preventDefault();

			$editorDiv.get(0)!.focus();

			const selection = window.getSelection();
			if (selection === null) return;

			const range = selection.getRangeAt(0);
			range.setStartAfter(span);
			range.setEndAfter(span);

			if (mfe.value === '') {
				$(mfe).parent().remove();
			} else {
				utils.insertAtCursor(document.createElement('br'));
				newMathField($editorDiv);
			}
		};
	});

	mfe.addEventListener('blur', (ev) => {
		if (ev.relatedTarget === undefined) return;

		const latexField = span.querySelector('textarea');
		if (latexField !== null && ev.relatedTarget === latexField) return;

		onBlur(mfe, span, ev);
	});
	mfe.addEventListener('focus', (e) => onFocus(mfe, span, e));
}

function onFocus(mfe: ML.MathfieldElement, span: HTMLSpanElement, e: FocusEvent) {
	if (mfe.readOnly === true) mfe.readOnly = false;

	if (span.classList.contains(styles['math-field-closed'])) span.classList.remove(styles['math-field-closed']);
	if (!span.classList.contains(styles['math-field-open'])) span.classList.add(styles['math-field-open']);
}

function onBlur(mfe: ML.MathfieldElement, span: HTMLSpanElement, e: FocusEvent) {
	e.preventDefault();

	mfe.readOnly = true;

	if (!span.classList.contains(styles['math-field-closed'])) span.classList.add(styles['math-field-closed']);
	if (span.classList.contains(styles['math-field-open'])) span.classList.remove(styles['math-field-open']);

	if (mfe.value === '') $(mfe).parent().remove();
}

export { newMathField, initializeSpan, initializeLaTeXEditor, addMathFieldEventListeners };
