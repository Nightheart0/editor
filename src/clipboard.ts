import { insertAtCursor } from './utils';

import editorStyles from './editor.module.css'

const fileTypes = ['image/png', 'image/jpeg'];

const file2Base64 = (file: File): Promise<string> => {
	return new Promise<string> ((resolve, reject)=> {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result?.toString() || '');
		reader.onerror = error => reject(error);
	});
}

function onPaste($editorDiv: JQuery<HTMLDivElement>, e: JQuery.TriggeredEvent<HTMLDivElement, undefined, HTMLDivElement, HTMLDivElement>) {
	const clipboardData = (e!.originalEvent as ClipboardEvent).clipboardData!;
    const file =
		clipboardData.items &&
		clipboardData.items.length > 0 &&
		clipboardData.items[clipboardData.items.length - 1].getAsFile();
	
	if (file) {
		e.preventDefault();
		if (fileTypes.indexOf(file.type) >= 0) {
			file2Base64(file)
				.then((value) => {
					const img = document.createElement('img');

					img.src = value;
					img.className = editorStyles.img;

					insertAtCursor(img);
				})
				.catch((reason) => {

				}
			);
		}
	}
}

export { onPaste };
