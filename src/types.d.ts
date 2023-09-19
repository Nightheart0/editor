declare module '*.css';
declare module '*.scss';

type EditorState = {
	focus: {
		richTextEditor: boolean;
		mathEquation: boolean;
	};

	styleAppliers: {
		bold: RangyClassApplier;
		italic: RangyClassApplier;
		underline: RangyClassApplier;
		strikethrough: RangyClassApplier;
		subscript: RangyClassApplier;
		superscript: RangyClassApplier;
	};

	$currentEditor: JQuery<HTMLDivElement> | null;
	$toolbar: JQuery<HTMLDivElement> | null;
	$helpDialog: JQuery<HTMLDialogElement> | null;

	firstCall: boolean;
};

type EditorSupportedLocale = 'en';

type EditorOptions = {
	locale?: EditorSupportedLocale;
	initialValue?: string;

	onInput?: (value: string) => void;
};

type EditorObject = {
	getValue: () => string;
};

interface Window {
	sunstarEditor: EditorState;
}

declare global {
	interface Window {
		sunstarEditor: EditorState;
	}
}
