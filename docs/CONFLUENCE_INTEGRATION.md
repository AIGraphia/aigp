# AIGP Confluence Integration

## Overview

Complete Atlassian Confluence integration for embedding, creating, and syncing AIGP diagrams in Confluence pages and spaces.

---

## Features

- ✅ Embed AIGP diagrams in Confluence pages
- ✅ Create diagrams from Confluence content
- ✅ Inline diagram editor (macro)
- ✅ Team library integration
- ✅ Real-time collaboration
- ✅ Version history with Confluence
- ✅ Export to multiple formats
- ✅ Jira issue linking

---

## Installation

### Via Atlassian Marketplace

1. Go to Confluence → Settings → Find new apps
2. Search "AIGP Diagrams"
3. Click "Install"
4. Accept permissions
5. Click "Get started"

### Self-Hosted Installation

```bash
git clone https://github.com/aigp/confluence-plugin.git
cd confluence-plugin
pnpm install
pnpm run build
atlas-mvn package  # Build Confluence plugin
```

Upload `target/confluence-aigp-plugin-1.0.0.jar` to Confluence.

---

## Architecture

```
confluence-plugin/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/aigp/confluence/
│   │   │       ├── MacroServlet.java
│   │   │       ├── RestResource.java
│   │   │       ├── DiagramService.java
│   │   │       └── ConfluenceConverter.java
│   │   └── resources/
│   │       ├── atlassian-plugin.xml
│   │       ├── js/
│   │       │   ├── macro-editor.js
│   │       │   └── diagram-viewer.js
│   │       └── css/
│   │           └── styles.css
│   └── test/
├── pom.xml
└── package.json
```

---

## Implementation

### 1. Plugin Descriptor

**atlassian-plugin.xml:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<atlassian-plugin key="com.aigp.confluence" name="AIGP Diagrams for Confluence" plugins-version="2">
    <plugin-info>
        <description>AI Graphic Protocol diagram integration for Confluence</description>
        <version>1.0.0</version>
        <vendor name="AIGP" url="https://aigp.dev"/>
        <param name="plugin-icon">images/pluginIcon.png</param>
        <param name="plugin-logo">images/pluginLogo.png</param>
    </plugin-info>

    <!-- Macro for embedding diagrams -->
    <xhtml-macro name="aigp-diagram" class="com.aigp.confluence.DiagramMacro" key="aigp-diagram-macro">
        <description>Embed AIGP diagram</description>
        <category name="formatting"/>
        <parameters>
            <parameter name="diagramId" type="string" required="false">
                <description>Diagram ID (for stored diagrams)</description>
            </parameter>
            <parameter name="source" type="string" required="false">
                <description>AIGP JSON source</description>
            </parameter>
            <parameter name="width" type="string" default="800">
                <description>Width in pixels</description>
            </parameter>
            <parameter name="height" type="string" default="600">
                <description>Height in pixels</description>
            </parameter>
            <parameter name="theme" type="enum" default="light">
                <description>Theme (light/dark)</description>
                <value name="light"/>
                <value name="dark"/>
            </parameter>
        </parameters>
        <resource type="download" name="macro-editor.js" location="js/macro-editor.js"/>
        <resource type="download" name="diagram-viewer.js" location="js/diagram-viewer.js"/>
        <resource type="download" name="styles.css" location="css/styles.css"/>
    </xhtml-macro>

    <!-- REST API -->
    <rest key="aigp-rest" path="/aigp" version="1.0">
        <package>com.aigp.confluence.rest</package>
    </rest>

    <!-- Web resources -->
    <web-resource key="aigp-resources" name="AIGP Resources">
        <resource type="download" name="aigp.min.js" location="js/aigp.min.js"/>
        <resource type="download" name="editor.js" location="js/editor.js"/>
        <resource type="download" name="styles.css" location="css/styles.css"/>
        <context>atl.general</context>
        <context>atl.editor</context>
    </web-resource>

    <!-- Editor Macro -->
    <web-item key="aigp-editor-button" name="AIGP Diagram Button" section="system.editor.featured" weight="1000">
        <label key="aigp.editor.label">AIGP Diagram</label>
        <link>/plugins/servlet/aigp/editor</link>
        <tooltip key="aigp.editor.tooltip">Insert AIGP diagram</tooltip>
        <icon width="16" height="16">
            <link>/download/resources/com.aigp.confluence/images/icon-small.png</link>
        </icon>
    </web-item>

    <!-- Admin Configuration -->
    <web-item key="aigp-admin" name="AIGP Admin" section="system.admin/integrations" weight="200">
        <label>AIGP Diagrams</label>
        <link>/plugins/servlet/aigp/admin</link>
    </web-item>
</atlassian-plugin>
```

---

### 2. Diagram Macro

**DiagramMacro.java:**

```java
package com.aigp.confluence;

import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.confluence.macro.MacroExecutionException;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;

import javax.inject.Inject;
import java.util.Map;

@Scanned
public class DiagramMacro implements Macro {

    private final DiagramService diagramService;

    @Inject
    public DiagramMacro(@ComponentImport DiagramService diagramService) {
        this.diagramService = diagramService;
    }

    @Override
    public String execute(Map<String, String> parameters, String body, ConversionContext conversionContext)
            throws MacroExecutionException {

        String diagramId = parameters.get("diagramId");
        String source = parameters.get("source");
        String width = parameters.getOrDefault("width", "800");
        String height = parameters.getOrDefault("height", "600");
        String theme = parameters.getOrDefault("theme", "light");

        try {
            String diagramJson;

            if (diagramId != null && !diagramId.isEmpty()) {
                // Load stored diagram
                diagramJson = diagramService.loadDiagram(diagramId);
            } else if (source != null && !source.isEmpty()) {
                // Use provided source
                diagramJson = source;
            } else if (body != null && !body.isEmpty()) {
                // Use macro body
                diagramJson = body;
            } else {
                return "<div class='aui-message aui-message-error'>" +
                       "<p>No diagram source provided. Please specify diagramId, source, or provide JSON in macro body.</p>" +
                       "</div>";
            }

            // Generate unique ID for this instance
            String instanceId = "aigp-diagram-" + System.currentTimeMillis();

            // Build HTML output
            StringBuilder html = new StringBuilder();

            html.append("<div class='aigp-diagram-container' ")
                .append("id='").append(instanceId).append("' ")
                .append("data-diagram='").append(escapeHtml(diagramJson)).append("' ")
                .append("data-width='").append(width).append("' ")
                .append("data-height='").append(height).append("' ")
                .append("data-theme='").append(theme).append("' ")
                .append("style='width:").append(width).append("px; height:").append(height).append("px; border:1px solid #ddd; border-radius:4px; overflow:hidden;'>");

            html.append("<div class='aigp-loading'>Loading diagram...</div>");

            html.append("</div>");

            // Add initialization script
            html.append("<script>")
                .append("(function() {")
                .append("  if (window.AIGPConfluence) {")
                .append("    window.AIGPConfluence.renderDiagram('").append(instanceId).append("');")
                .append("  } else {")
                .append("    document.addEventListener('DOMContentLoaded', function() {")
                .append("      window.AIGPConfluence.renderDiagram('").append(instanceId).append("');")
                .append("    });")
                .append("  }")
                .append("})();")
                .append("</script>");

            return html.toString();

        } catch (Exception e) {
            throw new MacroExecutionException("Failed to render AIGP diagram: " + e.getMessage(), e);
        }
    }

    @Override
    public BodyType getBodyType() {
        return BodyType.PLAIN_TEXT;
    }

    @Override
    public OutputType getOutputType() {
        return OutputType.BLOCK;
    }

    private String escapeHtml(String text) {
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}
```

---

### 3. REST API

**RestResource.java:**

```java
package com.aigp.confluence.rest;

import com.aigp.confluence.DiagramService;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("/diagrams")
@Scanned
public class RestResource {

    private final DiagramService diagramService;

    @Inject
    public RestResource(@ComponentImport DiagramService diagramService) {
        this.diagramService = diagramService;
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDiagram(@PathParam("id") String id) {
        try {
            String diagram = diagramService.loadDiagram(id);
            return Response.ok(diagram).build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return Response.status(Response.Status.NOT_FOUND).entity(error).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createDiagram(String diagramJson) {
        try {
            String id = diagramService.saveDiagram(diagramJson);

            Map<String, String> response = new HashMap<>();
            response.put("id", id);
            response.put("message", "Diagram created successfully");

            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
        }
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateDiagram(@PathParam("id") String id, String diagramJson) {
        try {
            diagramService.updateDiagram(id, diagramJson);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Diagram updated successfully");

            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteDiagram(@PathParam("id") String id) {
        try {
            diagramService.deleteDiagram(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Diagram deleted successfully");

            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
        }
    }

    @POST
    @Path("/convert-from-page")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response convertFromPage(Map<String, Object> params) {
        try {
            Long pageId = ((Number) params.get("pageId")).longValue();
            String diagramType = (String) params.get("diagramType");

            String diagram = diagramService.convertPageToAIGP(pageId, diagramType);

            return Response.ok(diagram).build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
        }
    }
}
```

---

### 4. Diagram Service

**DiagramService.java:**

```java
package com.aigp.confluence;

import com.atlassian.bandana.BandanaManager;
import com.atlassian.confluence.pages.Page;
import com.atlassian.confluence.pages.PageManager;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;

import javax.inject.Inject;
import java.util.UUID;

@Scanned
public class DiagramService {

    private static final String BANDANA_KEY_PREFIX = "com.aigp.confluence.diagram.";

    private final BandanaManager bandanaManager;
    private final PageManager pageManager;
    private final ConfluenceConverter confluenceConverter;

    @Inject
    public DiagramService(
        @ComponentImport BandanaManager bandanaManager,
        @ComponentImport PageManager pageManager,
        ConfluenceConverter confluenceConverter
    ) {
        this.bandanaManager = bandanaManager;
        this.pageManager = pageManager;
        this.confluenceConverter = confluenceConverter;
    }

    public String saveDiagram(String diagramJson) {
        String id = UUID.randomUUID().toString();
        bandanaManager.setValue(null, BANDANA_KEY_PREFIX + id, diagramJson);
        return id;
    }

    public String loadDiagram(String id) throws Exception {
        Object value = bandanaManager.getValue(null, BANDANA_KEY_PREFIX + id);

        if (value == null) {
            throw new Exception("Diagram not found: " + id);
        }

        return (String) value;
    }

    public void updateDiagram(String id, String diagramJson) throws Exception {
        // Check if exists
        Object existing = bandanaManager.getValue(null, BANDANA_KEY_PREFIX + id);

        if (existing == null) {
            throw new Exception("Diagram not found: " + id);
        }

        bandanaManager.setValue(null, BANDANA_KEY_PREFIX + id, diagramJson);
    }

    public void deleteDiagram(String id) throws Exception {
        Object existing = bandanaManager.getValue(null, BANDANA_KEY_PREFIX + id);

        if (existing == null) {
            throw new Exception("Diagram not found: " + id);
        }

        bandanaManager.removeValue(null, BANDANA_KEY_PREFIX + id);
    }

    public String convertPageToAIGP(Long pageId, String diagramType) throws Exception {
        Page page = pageManager.getPage(pageId);

        if (page == null) {
            throw new Exception("Page not found: " + pageId);
        }

        return confluenceConverter.convertPageToAIGP(page, diagramType);
    }
}
```

---

### 5. JavaScript Client

**js/diagram-viewer.js:**

```javascript
(function() {
  'use strict';

  // Load AIGP browser library
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@aigp/browser@1.0/dist/aigp.min.js';
  script.onload = initialize;
  document.head.appendChild(script);

  function initialize() {
    window.AIGPConfluence = {
      renderDiagram: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const diagramJson = container.dataset.diagram;
        const width = parseInt(container.dataset.width);
        const height = parseInt(container.dataset.height);
        const theme = container.dataset.theme;

        try {
          const diagram = JSON.parse(diagramJson);

          // Clear loading message
          container.innerHTML = '';

          // Render diagram
          const instance = AIGP.render(diagram, container, {
            width,
            height,
            theme,
            interactive: true,
            nodeClickHandler: (node) => {
              console.log('Node clicked:', node);
              // Could open a dialog with node details
            }
          });

          // Add edit button for edit mode
          if (isEditMode()) {
            addEditButton(container, diagram, instance);
          }

        } catch (error) {
          container.innerHTML = `
            <div class="aui-message aui-message-error">
              <p>Failed to render diagram: ${error.message}</p>
            </div>
          `;
        }
      }
    };

    // Render all diagrams on page
    document.querySelectorAll('.aigp-diagram-container').forEach(container => {
      window.AIGPConfluence.renderDiagram(container.id);
    });
  }

  function isEditMode() {
    return window.location.href.includes('/pages/editpage.action') ||
           window.location.href.includes('/pages/createpage.action');
  }

  function addEditButton(container, diagram, instance) {
    const editBtn = document.createElement('button');
    editBtn.className = 'aui-button aui-button-subtle';
    editBtn.textContent = 'Edit Diagram';
    editBtn.style.position = 'absolute';
    editBtn.style.top = '10px';
    editBtn.style.right = '10px';

    editBtn.onclick = () => {
      openDiagramEditor(diagram, instance);
    };

    container.style.position = 'relative';
    container.appendChild(editBtn);
  }

  function openDiagramEditor(diagram, instance) {
    // Open modal editor
    const dialog = new AJS.Dialog({
      width: 1000,
      height: 700,
      id: 'aigp-editor-dialog'
    });

    dialog.addHeader('Edit AIGP Diagram');

    const iframe = document.createElement('iframe');
    iframe.src = AJS.contextPath() + '/plugins/servlet/aigp/editor?diagram=' +
                 encodeURIComponent(JSON.stringify(diagram));
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';

    dialog.addPanel('Editor', iframe);

    dialog.addButton('Save', function() {
      // Get updated diagram from iframe
      iframe.contentWindow.postMessage({ type: 'get-diagram' }, '*');

      window.addEventListener('message', function handler(event) {
        if (event.data.type === 'diagram-data') {
          const updatedDiagram = event.data.diagram;
          instance.update(updatedDiagram);

          dialog.remove();
          window.removeEventListener('message', handler);
        }
      });
    });

    dialog.addButton('Cancel', function() {
      dialog.remove();
    });

    dialog.show();
  }

})();
```

---

### 6. Macro Editor

**js/macro-editor.js:**

```javascript
(function() {
  'use strict';

  AJS.MacroBrowser.setMacroJsOverride('aigp-diagram', {
    opener: function(macro) {
      const dialog = new AJS.Dialog({
        width: 800,
        height: 600,
        id: 'aigp-macro-editor'
      });

      dialog.addHeader('Insert AIGP Diagram');

      const form = `
        <form class="aui">
          <div class="field-group">
            <label for="aigp-source-type">Source Type</label>
            <select id="aigp-source-type" class="select">
              <option value="new">Create New</option>
              <option value="existing">Use Existing</option>
              <option value="json">Paste JSON</option>
              <option value="convert">Convert Page</option>
            </select>
          </div>

          <div class="field-group" id="aigp-existing-group" style="display:none;">
            <label for="aigp-diagram-id">Diagram ID</label>
            <input type="text" id="aigp-diagram-id" class="text" />
          </div>

          <div class="field-group" id="aigp-json-group" style="display:none;">
            <label for="aigp-json">AIGP JSON</label>
            <textarea id="aigp-json" rows="10" class="textarea"></textarea>
          </div>

          <div class="field-group" id="aigp-convert-group" style="display:none;">
            <label for="aigp-page-id">Page ID to Convert</label>
            <input type="text" id="aigp-page-id" class="text" />
            <label for="aigp-diagram-type">Diagram Type</label>
            <select id="aigp-diagram-type" class="select">
              <option value="auto">Auto-detect</option>
              <option value="flowchart">Flowchart</option>
              <option value="network">Network</option>
              <option value="sequence">Sequence</option>
            </select>
          </div>

          <div class="field-group">
            <label for="aigp-width">Width (px)</label>
            <input type="number" id="aigp-width" class="text" value="800" />
          </div>

          <div class="field-group">
            <label for="aigp-height">Height (px)</label>
            <input type="number" id="aigp-height" class="text" value="600" />
          </div>

          <div class="field-group">
            <label for="aigp-theme">Theme</label>
            <select id="aigp-theme" class="select">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </form>
      `;

      dialog.addPanel('Settings', form);

      // Source type change handler
      dialog.get('panel:0').on('change', '#aigp-source-type', function() {
        const sourceType = this.value;

        document.getElementById('aigp-existing-group').style.display =
          sourceType === 'existing' ? 'block' : 'none';

        document.getElementById('aigp-json-group').style.display =
          sourceType === 'json' ? 'block' : 'none';

        document.getElementById('aigp-convert-group').style.display =
          sourceType === 'convert' ? 'block' : 'none';
      });

      dialog.addButton('Insert', function() {
        const sourceType = document.getElementById('aigp-source-type').value;
        const width = document.getElementById('aigp-width').value;
        const height = document.getElementById('aigp-height').value;
        const theme = document.getElementById('aigp-theme').value;

        const params = {
          width,
          height,
          theme
        };

        if (sourceType === 'existing') {
          params.diagramId = document.getElementById('aigp-diagram-id').value;
        } else if (sourceType === 'json') {
          params.source = document.getElementById('aigp-json').value;
        } else if (sourceType === 'new') {
          // Open editor to create new diagram
          window.open(AJS.contextPath() + '/plugins/servlet/aigp/editor', '_blank');
          dialog.remove();
          return;
        } else if (sourceType === 'convert') {
          const pageId = document.getElementById('aigp-page-id').value;
          const diagramType = document.getElementById('aigp-diagram-type').value;

          // Convert page
          AJS.$.ajax({
            url: AJS.contextPath() + '/rest/aigp/1.0/diagrams/convert-from-page',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ pageId, diagramType }),
            success: function(diagram) {
              params.source = JSON.stringify(diagram);
              insertMacro(params);
              dialog.remove();
            },
            error: function(xhr) {
              AJS.flag({
                type: 'error',
                body: 'Failed to convert page: ' + xhr.responseText
              });
            }
          });

          return;
        }

        insertMacro(params);
        dialog.remove();
      });

      dialog.addButton('Cancel', function() {
        dialog.remove();
      });

      dialog.show();

      function insertMacro(params) {
        const macro = {
          name: 'aigp-diagram',
          params: params,
          body: params.source || ''
        };

        AJS.Rte.getEditor().execCommand('mceInsertRawHTML',
          false,
          Confluence.Macro.render(macro)
        );
      }
    }
  });

})();
```

---

## Usage Guide

### 1. Insert Diagram in Page

1. Edit Confluence page
2. Click "Insert" → "Other macros"
3. Search "AIGP"
4. Click "AIGP Diagram"
5. Configure options
6. Click "Insert"

### 2. Create New Diagram

1. Insert AIGP macro
2. Choose "Create New"
3. Opens diagram editor
4. Build diagram visually
5. Save and embed

### 3. Convert Existing Page

1. Insert AIGP macro
2. Choose "Convert Page"
3. Enter page ID
4. Select diagram type
5. Page content converts to diagram

---

## Configuration

**Confluence Admin:**

1. Go to Settings → Manage apps
2. Click "AIGP Diagrams"
3. Configure:
   - Default theme
   - Max diagram size
   - Storage location
   - API keys (if using hosted service)

---

## Jira Integration

Link AIGP diagrams to Jira issues:

```xml
<!-- In diagram metadata -->
{
  "metadata": {
    "title": "Sprint Planning",
    "jiraIssues": ["PROJ-123", "PROJ-456"],
    "jiraFilter": "project = PROJ AND sprint = 42"
  }
}
```

Diagrams automatically update when linked Jira issues change.

---

## Resources

- Atlassian Marketplace: https://marketplace.atlassian.com/apps/aigp
- Plugin Repository: https://github.com/aigp/confluence-plugin
- Confluence Cloud API: https://developer.atlassian.com/cloud/confluence/
- AIGP Protocol: https://aigp.dev/docs/protocol
- Support: https://github.com/aigp/confluence-plugin/issues
