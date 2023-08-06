import $ from 'jquery';
import * as ML from 'mathlive';

import * as utils from './utils';

function newMathField($editorDiv: JQuery<HTMLDivElement>) {
	const span = document.createElement('span');
	span.contentEditable = 'false';

	const mfe = new ML.MathfieldElement();

	mfe.addEventListener('click', (e) => {
		if (mfe.readOnly === true) {
			mfe.readOnly = false;
			setTimeout(() => mfe.focus(), 0);
		}
	});

	mfe.addEventListener('move-out', (e) => focusLost(mfe, e));
	mfe.addEventListener('focus-out', (e) => focusLost(mfe, e));
	mfe.addEventListener('focusout', (e) => focusLost(mfe, e));

	span.appendChild(document.createTextNode(new DOMParser().parseFromString('&nbsp;', 'text/html').documentElement.textContent as string));
	span.append(mfe);
	span.appendChild(document.createTextNode(new DOMParser().parseFromString('&nbsp;', 'text/html').documentElement.textContent as string));

	utils.insertAtCursor(span);
	setTimeout(() => mfe.focus(), 0);
}

function focusLost(mfElement: ML.MathfieldElement, e: CustomEvent<ML.MoveOutEvent | ML.FocusOutEvent> | FocusEvent) {
	e.preventDefault();

	mfElement.readOnly = true;
	if (mfElement.value === '') $(mfElement).parent().remove();
}

export { newMathField };
