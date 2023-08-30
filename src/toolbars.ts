import $ from 'jquery';

import { newMathField } from './math-field';
import { insertAtCursor } from './utils';
import { specialCharacterGroups} from './special-characters';
import type { Character as SpecialCharacter, Group as SpecialCharacterGroup } from './special-characters';
import latexCommandsWithSvg from './latex-commands-svg';
import * as richText from './rich-text';

import styles from './toolbars.module.css';

const gridButtonWidth = 35 /* px */;

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

	initToolsToolbar($toolbar as JQuery<HTMLDivElement>);
	initSpecialCharacterToolbar($toolbar as JQuery<HTMLDivElement>);
	bindToolbarButtonClick($toolbar as JQuery<HTMLDivElement>);
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
	}" ${char.latexCommand ? `data-command="${char.latexCommand}"` : ''} data-usewrite="${!char.noWrite}" data-buttontype="character">${
		char.character
	}</button>`;

const popularInGroup = (group: SpecialCharacterGroup) => group.characters.filter((character: SpecialCharacter) => character.popular).length;

function initSpecialCharacterToolbar($toolbar: JQuery<HTMLDivElement>) {
	$toolbar
		.find('[data-js="charactersList"]')
		.append(
			specialCharacterGroups.map(
				(group) => `<div class="${styles['toolbar-characters-group']}" style="width: ${popularInGroup(group) * gridButtonWidth}px">${group.characters.map(specialCharacterToButton).join('')}</div>`,
			) as any,
		);
}

function initToolsToolbar($toolbar: JQuery<HTMLDivElement>) {
	const $toolsRow = $(`<div class="${styles['toolbar-characters-group']}" style="width: ${24 * gridButtonWidth}px"></div>`);
	$toolbar
		.find('[data-js="charactersList"]')
		.append($toolsRow);

	$toolsRow.append(`<button class="${styles.button} ${styles['button-grid']} ${styles['characters-popular']} ${styles['toolbar-tool']}" data-command="bold" data-tooltip="Bold (Ctrl+B)">
		<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M295.771-215.001v-529.998h199.536q61.769 0 106.423 39.692 44.653 39.692 44.653 98.692 0 35.692-20.038 67.115-20.039 31.423-56.193 47.654v4.461q44.154 12.846 69.116 48.462 24.961 35.615 24.961 77.923 0 61.076-47.307 103.537-47.307 42.462-114.23 42.462H295.771ZM356-268.307h142.461q39.923 0 72.347-26.731 32.423-26.731 32.423-70.501 0-42.769-32.231-69.5t-72.154-26.731H356v193.463Zm0-244.308h135.23q38.077 0 67.039-25.307 28.962-25.308 28.962-64.539 0-38.462-28.769-64.462-28.77-26.001-67.232-26.001H356v180.309Z"/></svg>
	</button>`);
	$toolsRow.append(`<button class="${styles.button} ${styles['button-grid']} ${styles['characters-popular']} ${styles['toolbar-tool']}" data-command="italic" data-tooltip="Italic (Ctrl+I)">
		<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M233.231-214.386v-57.69h133.616L510.463-693H358.386v-57.691h351.536V-693H573.999L430.768-272.076h154v57.69H233.231Z"/></svg>
	</button>`);
	$toolsRow.append(`<button class="${styles.button} ${styles['button-grid']} ${styles['characters-popular']} ${styles['toolbar-tool']}" data-command="underline" data-tooltip="Underline (Ctrl+U)">
		<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M213.847-169.618v-45.383h532.306v45.383H213.847ZM480-298.848q-92.307 0-145.153-53.499-52.846-53.5-52.846-145.422V-823.46h59.537v324.921q0 65.693 36.692 104.462 36.693 38.77 101.77 38.77t101.77-38.77q36.692-38.769 36.692-104.462V-823.46h59.537v325.691q0 91.922-52.846 145.422Q572.307-298.848 480-298.848Z"/></svg>
	</button>`);
	$toolsRow.append(`<button class="${styles.button} ${styles['button-grid']} ${styles['characters-popular']} ${styles['toolbar-tool']}" data-command="strikethrough" data-tooltip="Strikethrough (Ctrl+D)">
		<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M100.001-417.693v-45.383h759.998v45.383H100.001Zm345-109.999v-181.924H220.386v-70.383h519.613v70.383H515.384v181.924h-70.383Zm0 347.691v-173.076h70.383v173.076h-70.383Z"/></svg>
	</button>`);
	$toolsRow.append(`<button class="${styles.button} ${styles['button-grid']} ${styles['characters-popular']} ${styles['toolbar-tool']}" data-command="subscript" data-tooltip="Subscript (Ctrl+,)">
		<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M754.384-180.001v-64.231q0-12.615 8.115-20.731 8.115-8.115 20.731-8.115h84.076v-36.923H754.384v-28.077h112.153q12.615 0 20.73 8.116 8.116 8.115 8.116 20.731v35.384q0 12.615-8.116 20.731-8.115 8.115-20.73 8.115H782.46v36.923h112.923v28.077H754.384Zm-496.69-72.308 176.153-274.845-162.768-252.845h64.075l136.539 213.385h-.385l138.077-213.385h63.691L509.538-527.154l176.538 274.845H623L471.308-487.463h.385L320.769-252.309h-63.075Z"/></svg>
	</button>`);
	$toolsRow.append(`<button class="${styles.button} ${styles['button-grid']} ${styles['characters-popular']} ${styles['toolbar-tool']}" data-command="superscript" data-tooltip="Superscript (Ctrl+.)">
		<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M754.384-621.922v-64.231q0-12.615 8.115-20.731 8.115-8.115 20.731-8.115h84.076v-36.923H754.384v-28.077h112.153q12.615 0 20.73 8.116 8.116 8.115 8.116 20.731v35.384q0 12.615-8.116 20.731-8.115 8.115-20.73 8.115H782.46v36.923h112.923v28.077H754.384Zm-496.69 441.921 176.153-274.845-162.768-252.845h64.075l136.539 213.384h-.385l138.077-213.384h63.691L509.538-454.846l176.538 274.845H623L471.308-415.155h.385L320.769-180.001h-63.075Z"/></svg>
	</button>`);
	$toolsRow.append(`<button class="${styles.button} ${styles['button-grid']} ${styles['characters-popular']} ${styles['toolbar-tool']}" data-command="increase-indent" data-tooltip="Increase Indent">
		<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M140.001-140.001v-45.384h679.998v45.384H140.001Zm320-158.846v-45.384h359.998v45.384H460.001Zm0-158.461v-45.384h359.998v45.384H460.001Zm0-158.846v-45.383h359.998v45.383H460.001Zm-320-158.461v-45.384h679.998v45.384H140.001Zm0 413.921v-240.228l122.153 118.691-122.153 121.537Z"/></svg>
	</button>`);
	$toolsRow.append(`<button class="${styles.button} ${styles['button-grid']} ${styles['characters-popular']} ${styles['toolbar-tool']}" data-command="decrease-indent" data-tooltip="Decrease Indent">
		<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M140.001-140.001v-45.384h679.998v45.384H140.001Zm320-158.846v-45.384h359.998v45.384H460.001Zm0-158.461v-45.384h359.998v45.384H460.001Zm0-158.846v-45.383h359.998v45.383H460.001Zm-320-158.461v-45.384h679.998v45.384H140.001Zm122.153 413.921L140.001-482.231l122.153-118.691v240.228Z"/></svg>
	</button>`);
}

function bindToolbarButtonClick($toolbar: JQuery<HTMLDivElement>) {
	$toolbar.on('mousedown', 'button', (e) => {
		e.preventDefault();

		const buttonType: string = e.currentTarget.dataset.buttontype;
		const command: string = e.currentTarget.dataset.command;

		if (buttonType === 'character') {
			richText.insertCharacterButonClick(e);
		} else if (command === 'bold') {
			richText.toggleBold();
		} else if (command === 'italic') {
			richText.toggleItalic();
		} else if (command === 'underline') {
			richText.toggleUnderline();
		} else if (command === 'strikethrough') {
			richText.toggleStrikethrough();
		} else if (command === 'subscript') {
			richText.toggleSubscript();
		} else if (command === 'superscript') {
			richText.toggleSuperscript();
		}
	});
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
