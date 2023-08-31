declare module '*.css';
declare module '*.scss';

type EditorState = {
	focus: {
		richTextEditor: boolean;
		mathEquation: boolean;
	};

	$currentEditor: JQuery<HTMLDivElement> | null;
	$toolbar: JQuery<HTMLDivElement> | null;
	$helpOverlay: JQuery<HTMLDivElement> | null;

	firstCall: boolean;
};

type EditorSupportedLocale = 'en';

type EditorOptions = {
	locale?: EditorSupportedLocale;
	initialContents?: string;
};

interface Window {
	editor2: EditorState;
}

declare global {
	interface Window {
		editor2: EditorState;
	}
}
