/**
 * Plugin exports
 */

export * from './base.js';

// Import all plugins
import { registerPlugin } from './base.js';
import { flowchartPlugin } from './types/flowchart/index.js';
import { sequencePlugin } from './types/sequence/index.js';
import { architecturePlugin } from './types/architecture/index.js';
import { orgChartPlugin } from './types/org-chart/index.js';
import { mindMapPlugin } from './types/mind-map/index.js';
import { erPlugin } from './types/er/index.js';
import { umlClassPlugin } from './types/uml-class/index.js';
import { timelinePlugin } from './types/timeline/index.js';
import { networkPlugin } from './types/network/index.js';
import { bpmnPlugin } from './types/bpmn/index.js';
import { sankeyPlugin } from './types/sankey/index.js';
import { funnelPlugin } from './types/funnel/index.js';
import { stateMachinePlugin } from './types/state-machine/index.js';
import { kanbanPlugin } from './types/kanban/index.js';
import { treemapPlugin } from './types/treemap/index.js';
import { circlePackingPlugin } from './types/circle-packing/index.js';
import { sunburstPlugin } from './types/sunburst/index.js';
import { chordPlugin } from './types/chord/index.js';
import { alluvialPlugin } from './types/alluvial/index.js';
import { petriNetPlugin } from './types/petri-net/index.js';

// Re-export all plugins
export { flowchartPlugin } from './types/flowchart/index.js';
export { sequencePlugin } from './types/sequence/index.js';
export { architecturePlugin } from './types/architecture/index.js';
export { orgChartPlugin } from './types/org-chart/index.js';
export { mindMapPlugin } from './types/mind-map/index.js';
export { erPlugin } from './types/er/index.js';
export { umlClassPlugin } from './types/uml-class/index.js';
export { timelinePlugin } from './types/timeline/index.js';
export { networkPlugin } from './types/network/index.js';
export { bpmnPlugin } from './types/bpmn/index.js';
export { sankeyPlugin } from './types/sankey/index.js';
export { funnelPlugin } from './types/funnel/index.js';
export { stateMachinePlugin } from './types/state-machine/index.js';
export { kanbanPlugin } from './types/kanban/index.js';
export { treemapPlugin } from './types/treemap/index.js';
export { circlePackingPlugin } from './types/circle-packing/index.js';
export { sunburstPlugin } from './types/sunburst/index.js';
export { chordPlugin } from './types/chord/index.js';
export { alluvialPlugin } from './types/alluvial/index.js';
export { petriNetPlugin } from './types/petri-net/index.js';

// Auto-register all plugins
registerPlugin(flowchartPlugin);
registerPlugin(sequencePlugin);
registerPlugin(architecturePlugin);
registerPlugin(orgChartPlugin);
registerPlugin(mindMapPlugin);
registerPlugin(erPlugin);
registerPlugin(umlClassPlugin);
registerPlugin(timelinePlugin);
registerPlugin(networkPlugin);
registerPlugin(bpmnPlugin);
registerPlugin(sankeyPlugin);
registerPlugin(funnelPlugin);
registerPlugin(stateMachinePlugin);
registerPlugin(kanbanPlugin);
registerPlugin(treemapPlugin);
registerPlugin(circlePackingPlugin);
registerPlugin(sunburstPlugin);
registerPlugin(chordPlugin);
registerPlugin(alluvialPlugin);
registerPlugin(petriNetPlugin);
