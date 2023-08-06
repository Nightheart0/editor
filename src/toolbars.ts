import $ from 'jquery';

import styles from './toolbars.module.css';

function init() {
	const $toolbar = $(`
	<div class="rich-text-editor-tools" data-js="tools">
		<div class="rich-text-editor-tools-button-wrapper">
			<div class="rich-text-editor-toolbar-wrapper">
				<button class="rich-text-editor-characters-expand-collapse" data-js="expandCollapseCharacters" style="z-index: 100"></button>
			</div>
			<div class="rich-text-editor-toolbar-wrapper">
				<button class="rich-text-editor-help-button" data-js="richTextEditorHelp" style="z-index: 100"></button>
			</div>
		</div>
		<div class="rich-text-editor-tools-row">
			<div class="rich-text-editor-toolbar-wrapper">
				<div class="rich-text-editor-toolbar-characters rich-text-editor-toolbar rich-text-editor-toolbar-button-list" data-js="charactersList"></div>
			</div>
		</div>
		<div class="rich-text-editor-tools-row">
			<div class="rich-text-editor-toolbar-wrapper rich-text-editor-equation-wrapper">
				<div class="rich-text-editor-toolbar-equation rich-text-editor-toolbar rich-text-editor-toolbar-button-list" data-js="mathToolbar"></div>
			</div>
		</div>
		<div class="rich-text-editor-tools-button-wrapper">
			<div class="rich-text-editor-toolbar-wrapper">
				<button class="rich-text-editor-new-equation rich-text-editor-button rich-text-editor-button-action" data-js="newEquation" data-command="Ctrl + E" data-i18n="rich_text_editor.insert_equation"></button>
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
			$toolbar.toggleClass('rich-text-editor-show-all-characters');
		})
		.on('mousedown', '[data-js="richTextEditorHelp"]', (e) => {
			e.preventDefault();
			// Show help
		});

	const $newEquation = $toolbar.find('[data-js="newEquation"]')
	const $mathToolbar = $toolbar.find('[data-js="mathToolbar"]')

	return $toolbar;
}
