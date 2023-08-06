declare module '*.css';
declare module '*.scss';

type MistyEditorState = {
	focus: {
		richTextEditor: boolean;
		mathEquation: boolean;
	};

	$currentEditor: JQuery<HTMLDivElement> | null;
	$toolbar: JQuery<HTMLDivElement> | null;
	$helpOverlay: JQuery<HTMLDivElement> | null;

	firstCall: boolean;
};

type MistyEditorSupportedLocale = 'en';

type MistyEditorOptions = {
	locale?: MistyEditorSupportedLocale;
};

interface Window {
	mistyEditor: MistyEditorState;
}

declare global {
	interface Window {
		mistyEditor: MistyEditorState;
	}
}
