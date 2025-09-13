export function initMonaco(monaco: typeof import("monaco-editor")) {

    monaco.languages.register({ id: "xml" });

    monaco.editor.defineTheme("shadcn-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#0a0a0a",
        },
    });

    monaco.editor.defineTheme("shadcn-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#ffffff",
        },
    });
}
