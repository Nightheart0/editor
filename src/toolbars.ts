import $ from 'jquery';

import { newMathField } from './math-field';
import { insertAtCursor } from './utils';
import { specialCharacterGroups} from './special-characters';
import type { Character as SpecialCharacter, Group as SpecialCharacterGroup } from './special-characters';
import latexCommandsWithSvg from './latex-commands-svg';

import styles from './toolbars.module.css';

function init() {
	const $toolbar = $(`
	<div class="${styles.tools}" data-js="tools">
		<div class="${styles['tools-button-wrapper']}">
			<div class="${styles['toolbar-wrapper']}">
				<button class="${styles['characters-expand-collapse']}" data-js="expandCollapseCharacters" style="z-index: 100"></button>
			</div>
			<div class="${styles['toolbar-wrapper']}">
				<button class="${styles['help-button']}" data-js="richTextEditorHelp" style="z-index: 100"></button>
			</div>
		</div>
		<div class="${styles['tools-row']}">
			<div class="${styles['toolbar-wrapper']}">
				<div class="${styles['toolbar-characters']} ${styles.toolbar} ${styles['toolbar-button-list']}" data-js="charactersList"></div>
			</div>
		</div>
		<div class="${styles['tools-row']}">
			<div class="${styles['toolbar-wrapper']} ${styles['equation-wrapper']}">
				<div class="${styles['toolbar-equation']} ${styles.toolbar} ${styles['toolbar-button-list']}" data-js="mathToolbar"></div>
			</div>
		</div>
		<div class="${styles['tools-button-wrapper']}">
			<div class="${styles['toolbar-wrapper']}">
				<button class="${styles['new-equation']} ${styles.button} ${styles['button-action']}" data-js="newEquation" data-command="Ctrl + E" data-i18n="rich_text_editor.insert_equation">Σ Insert Equation</button>
			</div>
		</div>
	</div>
	`);

	$toolbar
		.on('mousedown', (e) => {
			e.preventDefault();
		})
		.on('mousedown', '[data-js="expandCollapseCharacters"]', (e) => {
			e.preventDefault();
			$toolbar.toggleClass(styles['show-all-characters']);
		})
		.on('mousedown', '[data-js="richTextEditorHelp"]', (e) => {
			e.preventDefault();
			// Show help
		});

	const $insertEquation = $toolbar.find('[data-js="newEquation"]');
	const $mathToolbar = $toolbar.find('[data-js="mathToolbar"]');

	initSpecialCharacterToolbar($toolbar as JQuery<HTMLDivElement>);
	//initMathToolbar($mathToolbar as JQuery<HTMLDivElement>);
	initInsertEquation($insertEquation as JQuery<HTMLButtonElement>);

	/*
	if ($.fn.i18n) {
		$toolbar.i18n()
	} else if ($.fn.localize) {
		$toolbar.localize()
	}
	*/

	return $toolbar;
}

const specialCharacterToButton = (char: SpecialCharacter) =>
	`<button class="${styles.button} ${styles['button-grid']}${
		char.popular ? ` ${styles['characters-popular']}` : ''
	}" ${char.latexCommand ? `data-command="${char.latexCommand}"` : ''} data-usewrite="${!char.noWrite}">${
		char.character
	}</button>`;

const popularInGroup = (group: SpecialCharacterGroup) => group.characters.filter((character: SpecialCharacter) => character.popular).length;

function initSpecialCharacterToolbar($toolbar: JQuery<HTMLDivElement>) {
	const gridButtonWidth = 35 /* px */;

	$toolbar
		.find('[data-js="charactersList"]')
		.append(
			specialCharacterGroups.map(
				(group) => `<div class="${styles['toolbar-characters-group']}" style="width: ${popularInGroup(group) * gridButtonWidth}px">${group.characters.map(specialCharacterToButton).join('')}</div>`,
			) as any,
		)
		.on('mousedown', 'button', (e) => {
			e.preventDefault();

			const character: string = e.currentTarget.innerText;
			const command = e.currentTarget.dataset.command;
			const useWrite = e.currentTarget.dataset.usewrite === 'true';

			if (window.editor2.$currentEditor !== null) {
				insertAtCursor(character);
			}

			//if (hasAnswerFocus()) window.document.execCommand('insertText', false, character)
			//else mathEditor.insertMath(command || character, undefined, useWrite)
        })
}

function initMathToolbar($mathToolbar: JQuery<HTMLDivElement>) {
	$mathToolbar.append(
		latexCommandsWithSvg
			.map((o) =>
				typeof o === 'string' ? o :
					`<button class="${styles.button} ${styles['button-grid']}" data-command="${o.action}"
						data-latexcommand="${o.label || ''}" data-usewrite="${o.useWrite || false}">
							<img src="${o.svg}"/>
					</button>`,
			)
			.join(''),
	)
	.on('mousedown', `.${styles['button-grid']}`, (e) => {
		e.preventDefault();
		const dataset = e.currentTarget.dataset;
		//mathEditor.insertMath(dataset.command, dataset.latexcommand, dataset.usewrite === 'true')
	});

	$mathToolbar
		.append(
			`<div class="${styles['undo-redo-wrapper']}">
				<button class="${styles.button} rich-text-editor-undo-redo rich-text-editor-undo-button" disabled="true" data-command="Ctrl + Z" data-js="mathUndo"></button>
				<button class="${styles.button} rich-text-editor-undo-redo rich-text-editor-redo-button" disabled="true" data-command="Ctrl + Y" data-js="mathRedo"></button>
			</div>`,
		)
		.on('mousedown', '[data-js="mathUndo"]', (e) => {
			e.preventDefault()
			//mathEditor.undoMath()
		})
		.on('mousedown', '[data-js="mathRedo"]', (e) => {
			e.preventDefault()
			//mathEditor.redoMath()
		});
}

function initInsertEquation($insertEquation: JQuery<HTMLButtonElement>) {
	$insertEquation.on('mousedown', (e) => {
		if (window.editor2.$currentEditor === null) return;
		newMathField(window.editor2.$currentEditor);
	});
}

export { init };
