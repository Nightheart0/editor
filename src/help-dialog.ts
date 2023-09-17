import $ from 'jquery';

function init() {
	const $helpDialog = $(`
	<dialog id="sunstar-editor-help" data-js="sunstar-help-dialog">
		<h1>Sunstar's Editor</h1>

	</dialog>
	`);

	return $helpDialog;
}

export { init };
