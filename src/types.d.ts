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
	$helpOverlay: JQuery<HTMLDivElement> | null;

	firstCall: boolean;
};

type EditorSupportedLocale = 'en';

type EditorOptions = {
	locale?: EditorSupportedLocale;
	initialContents?: string;

	onInput?: (value: string) => void;
};

interface Window {
	sunstarEditor: EditorState;
}

declare global {
	interface Window {
		sunstarEditor: EditorState;
	}
}
