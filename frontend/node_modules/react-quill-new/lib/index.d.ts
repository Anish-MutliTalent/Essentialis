import React from 'react';
import Quill, { type EmitterSource, type Range as RangeStatic, QuillOptions as QuillOptionsStatic } from 'quill';
import type DeltaStatic from 'quill-delta';
export { Quill };
export type { DeltaStatic, EmitterSource, RangeStatic, QuillOptionsStatic };
declare namespace ReactQuill {
    type Value = string | DeltaStatic;
    type Range = RangeStatic | null;
    interface QuillOptions extends QuillOptionsStatic {
        tabIndex?: number;
    }
    interface ReactQuillProps {
        bounds?: string | HTMLElement;
        children?: React.ReactElement<any>;
        className?: string;
        defaultValue?: Value;
        formats?: string[];
        id?: string;
        modules?: QuillOptions['modules'];
        onChange?(value: string, delta: DeltaStatic, source: EmitterSource, editor: UnprivilegedEditor): void;
        onChangeSelection?(selection: Range, source: EmitterSource, editor: UnprivilegedEditor): void;
        onFocus?(selection: Range, source: EmitterSource, editor: UnprivilegedEditor): void;
        onBlur?(previousSelection: Range, source: EmitterSource, editor: UnprivilegedEditor): void;
        onKeyDown?: React.EventHandler<any>;
        onKeyPress?: React.EventHandler<any>;
        onKeyUp?: React.EventHandler<any>;
        placeholder?: string;
        preserveWhitespace?: boolean;
        readOnly?: boolean;
        style?: React.CSSProperties;
        tabIndex?: number;
        theme?: string;
        value?: Value;
    }
    interface UnprivilegedEditor {
        getLength: Quill['getLength'];
        getText: Quill['getText'];
        getHTML: () => string;
        getSemanticHTML: Quill['getSemanticHTML'];
        getBounds: Quill['getBounds'];
        getSelection: Quill['getSelection'];
        getContents: Quill['getContents'];
    }
}
import Value = ReactQuill.Value;
import Range = ReactQuill.Range;
import QuillOptions = ReactQuill.QuillOptions;
import ReactQuillProps = ReactQuill.ReactQuillProps;
import UnprivilegedEditor = ReactQuill.UnprivilegedEditor;
interface ReactQuillState {
    generation: number;
}
declare class ReactQuill extends React.Component<ReactQuillProps, ReactQuillState> {
    editingAreaRef: React.RefObject<any>;
    static displayName: string;
    static Quill: typeof Quill;
    dirtyProps: (keyof ReactQuillProps)[];
    cleanProps: (keyof ReactQuillProps)[];
    static defaultProps: {
        theme: string;
        modules: {};
        readOnly: boolean;
    };
    state: ReactQuillState;
    editor?: Quill;
    value: Value;
    selection: Range;
    lastDeltaChangeSet?: DeltaStatic;
    regenerationSnapshot?: {
        delta: DeltaStatic;
        selection: Range;
    };
    unprivilegedEditor?: UnprivilegedEditor;
    constructor(props: ReactQuillProps);
    validateProps(props: ReactQuillProps): void;
    shouldComponentUpdate(nextProps: ReactQuillProps, nextState: ReactQuillState): boolean;
    shouldComponentRegenerate(nextProps: ReactQuillProps): boolean;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: ReactQuillProps, prevState: ReactQuillState): void;
    instantiateEditor(): void;
    destroyEditor(): void;
    isControlled(): boolean;
    getEditorConfig(): QuillOptions;
    getEditor(): Quill;
    /**
    Creates an editor on the given element. The editor will be passed the
    configuration, have its events bound,
    */
    createEditor(element: HTMLElement, config: QuillOptions): Quill;
    hookEditor(editor: Quill): void;
    unhookEditor(editor: Quill): void;
    getEditorContents(): Value;
    getEditorSelection(): Range;
    isDelta(value: any): boolean;
    isEqualValue(value: any, nextValue: any): boolean;
    setEditorContents(editor: Quill, value: Value): void;
    setEditorSelection(editor: Quill, range: Range): void;
    setEditorTabIndex(editor: Quill, tabIndex: number): void;
    setEditorReadOnly(editor: Quill, value: boolean): void;
    makeUnprivilegedEditor(editor: Quill): {
        getHTML: () => string;
        getSemanticHTML: {
            (range: RangeStatic): string;
            (index?: number | undefined, length?: number | undefined): string;
        };
        getLength: () => number;
        getText: {
            (range?: RangeStatic | undefined): string;
            (index?: number | undefined, length?: number | undefined): string;
        };
        getContents: (index?: number | undefined, length?: number | undefined) => DeltaStatic;
        getSelection: {
            (focus: true): RangeStatic;
            (focus?: boolean | undefined): RangeStatic | null;
        };
        getBounds: (index: number | RangeStatic, length?: number | undefined) => import("quill").Bounds | null;
    };
    getEditingArea(): HTMLElement;
    renderEditingArea(): JSX.Element;
    render(): JSX.Element;
    onEditorChange: (eventName: 'text-change' | 'selection-change', rangeOrDelta: Range | DeltaStatic, oldRangeOrDelta: Range | DeltaStatic, source: EmitterSource) => void;
    onEditorChangeText(value: string, delta: DeltaStatic, source: EmitterSource, editor: UnprivilegedEditor): void;
    onEditorChangeSelection(nextSelection: RangeStatic, source: EmitterSource, editor: UnprivilegedEditor): void;
    focus(): void;
    blur(): void;
}
export default ReactQuill;
