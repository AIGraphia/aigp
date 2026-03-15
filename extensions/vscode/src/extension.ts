import * as vscode from 'vscode';
import * as path from 'path';
import { convertToMermaid } from '@aigraphia/converters';
import { validateFull } from '@aigraphia/protocol';

export function activate(context: vscode.ExtensionContext) {
    console.log('AIGP extension is now active');

    // Preview command
    const previewCommand = vscode.commands.registerCommand('aigp.preview', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        const document = editor.document;
        if (!document.fileName.endsWith('.json')) {
            vscode.window.showErrorMessage('Not an AIGP file (.json)');
            return;
        }

        const content = document.getText();
        try {
            const aigpDoc = JSON.parse(content);
            const mermaid = convertToMermaid(aigpDoc);

            const panel = vscode.window.createWebviewPanel(
                'aigpPreview',
                `Preview: ${path.basename(document.fileName)}`,
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true
                }
            );

            panel.webview.html = getWebviewContent(mermaid, aigpDoc.metadata?.title || 'AIGP Diagram');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to preview: ${error.message}`);
        }
    });

    // Validate command
    const validateCommand = vscode.commands.registerCommand('aigp.validate', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const content = document.getText();

        try {
            const aigpDoc = JSON.parse(content);
            const result = validateFull(aigpDoc);

            if (result.valid) {
                vscode.window.showInformationMessage('✅ AIGP document is valid');
            } else {
                vscode.window.showErrorMessage(`❌ Validation failed: ${result.errors?.join(', ')}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Invalid JSON: ${error.message}`);
        }
    });

    // Convert to Mermaid command
    const convertCommand = vscode.commands.registerCommand('aigp.convertToMermaid', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const content = document.getText();

        try {
            const aigpDoc = JSON.parse(content);
            const mermaid = convertToMermaid(aigpDoc);

            const outputDoc = await vscode.workspace.openTextDocument({
                content: mermaid,
                language: 'mermaid'
            });
            await vscode.window.showTextDocument(outputDoc, vscode.ViewColumn.Beside);
        } catch (error) {
            vscode.window.showErrorMessage(`Conversion failed: ${error.message}`);
        }
    });

    // New diagram command
    const newDiagramCommand = vscode.commands.registerCommand('aigp.newDiagram', async () => {
        const diagramTypes = [
            'flowchart',
            'sequence',
            'class',
            'er',
            'state-machine',
            'bpmn',
            'architecture',
            'org-chart',
            'mind-map',
            'network',
            'timeline',
            'kanban',
            'sankey',
            'funnel'
        ];

        const selected = await vscode.window.showQuickPick(diagramTypes, {
            placeHolder: 'Select diagram type'
        });

        if (!selected) return;

        const template = getTemplateForType(selected);
        const doc = await vscode.workspace.openTextDocument({
            content: JSON.stringify(template, null, 2),
            language: 'json'
        });
        await vscode.window.showTextDocument(doc);
    });

    // Validation on save
    const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
        const config = vscode.workspace.getConfiguration('aigp');
        if (!config.get('validation.onSave')) return;

        if (document.fileName.endsWith('.json')) {
            vscode.commands.executeCommand('aigp.validate');
        }
    });

    context.subscriptions.push(
        previewCommand,
        validateCommand,
        convertCommand,
        newDiagramCommand,
        saveListener
    );
}

function getWebviewContent(mermaid: string, title: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: #ffffff;
        }
        h1 {
            color: #2563eb;
            margin-bottom: 20px;
        }
        .mermaid {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="mermaid">
${mermaid}
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
</body>
</html>
    `;
}

function getTemplateForType(type: string): any {
    return {
        schema: "https://aigraphia.com/schema/v1",
        version: "1.0.0",
        type,
        metadata: {
            title: `New ${type} Diagram`,
            description: `A ${type} diagram created with AIGP`,
            author: "VS Code Extension",
            tags: [type, "aigp"]
        },
        graph: {
            nodes: [
                { id: "node1", type: "process", label: "Node 1", data: {} },
                { id: "node2", type: "process", label: "Node 2", data: {} }
            ],
            edges: [
                { id: "e1", source: "node1", target: "node2", type: "flow", data: {} }
            ]
        },
        layout: {
            algorithm: "hierarchical",
            direction: "TB"
        }
    };
}

export function deactivate() {}
