/**
 * Architecture diagram plugin
 */

import { DiagramPlugin } from '../../base';
import { AIGraphDocument, validateFull } from '@aigraphia/protocol';

export const architecturePlugin: DiagramPlugin = {
  type: 'architecture',
  name: 'Architecture Diagram',
  description: 'System design, microservices, infrastructure',

  nodeTypes: {
    service: {
      name: 'service',
      label: 'Service',
      description: 'Microservice or application service',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
      },
    },
    database: {
      name: 'database',
      label: 'Database',
      description: 'Database system',
      defaultStyle: {
        shape: 'cylinder',
        backgroundColor: '#4caf50',
        textColor: '#ffffff',
      },
    },
    cache: {
      name: 'cache',
      label: 'Cache',
      description: 'Caching layer (Redis, Memcached)',
      defaultStyle: {
        shape: 'ellipse',
        backgroundColor: '#ff9800',
        textColor: '#ffffff',
      },
    },
    queue: {
      name: 'queue',
      label: 'Message Queue',
      description: 'Message queue or event bus',
      defaultStyle: {
        shape: 'parallelogram',
        backgroundColor: '#9c27b0',
        textColor: '#ffffff',
      },
    },
    storage: {
      name: 'storage',
      label: 'Storage',
      description: 'Object storage or file system',
      defaultStyle: {
        shape: 'cylinder',
        backgroundColor: '#00bcd4',
        textColor: '#ffffff',
      },
    },
    loadbalancer: {
      name: 'loadbalancer',
      label: 'Load Balancer',
      description: 'Load balancer or API gateway',
      defaultStyle: {
        shape: 'hexagon',
        backgroundColor: '#795548',
        textColor: '#ffffff',
      },
    },
    external: {
      name: 'external',
      label: 'External Service',
      description: 'Third-party service or API',
      defaultStyle: {
        shape: 'rectangle',
        backgroundColor: '#607d8b',
        textColor: '#ffffff',
        borderStyle: 'dashed',
      },
    },
  },

  edgeTypes: {
    http: {
      name: 'http',
      label: 'HTTP/REST',
      description: 'HTTP or REST API call',
      defaultStyle: {
        strokeColor: '#2196f3',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
    grpc: {
      name: 'grpc',
      label: 'gRPC',
      description: 'gRPC call',
      defaultStyle: {
        strokeColor: '#4caf50',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
    message: {
      name: 'message',
      label: 'Message/Event',
      description: 'Asynchronous message or event',
      defaultStyle: {
        strokeColor: '#9c27b0',
        strokeWidth: 2,
        arrowEnd: 'arrow',
        strokeStyle: 'dashed',
      },
    },
    data: {
      name: 'data',
      label: 'Data Flow',
      description: 'Data flow or storage access',
      defaultStyle: {
        strokeColor: '#ff9800',
        strokeWidth: 2,
        arrowEnd: 'arrow',
      },
    },
  },

  groupTypes: {
    vpc: {
      name: 'vpc',
      label: 'VPC/Network',
      description: 'Virtual private cloud or network boundary',
      defaultStyle: {
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        borderWidth: 2,
      },
    },
    cluster: {
      name: 'cluster',
      label: 'Cluster',
      description: 'Kubernetes cluster or service group',
      defaultStyle: {
        backgroundColor: '#f3e5f5',
        borderColor: '#9c27b0',
        borderWidth: 2,
      },
    },
    region: {
      name: 'region',
      label: 'Region/Zone',
      description: 'Geographic region or availability zone',
      defaultStyle: {
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
        borderWidth: 2,
        borderStyle: 'dashed',
      },
    },
  },

  validator: (diagram: AIGraphDocument) => {
    return validateFull(diagram);
  },

  defaultLayout: {
    algorithm: 'layered',
    direction: 'TB',
    spacing: {
      node: 80,
      rank: 100,
    },
  },

  defaultStyles: {
    defaultNodeStyle: {
      borderWidth: 2,
      padding: 15,
    },
    defaultEdgeStyle: {
      strokeWidth: 2,
    },
  },

  aiPrompts: {
    systemPrompt: `Architecture diagrams show system components and their interactions.

Node types:
- service: Application services or microservices
- database: Databases (SQL, NoSQL)
- cache: Caching layers (Redis, Memcached)
- queue: Message queues or event buses (Kafka, RabbitMQ)
- storage: Object storage or file systems (S3, GCS)
- loadbalancer: Load balancers or API gateways
- external: Third-party services or APIs

Edge types:
- http: HTTP/REST API calls
- grpc: gRPC calls
- message: Asynchronous messages or events
- data: Data flow or storage access

Group types:
- vpc: Network boundaries or VPCs
- cluster: Kubernetes clusters or service groups
- region: Geographic regions or availability zones

Best practices:
- Group related services together
- Show data flow direction clearly
- Label edges with protocols or technologies
- Use groups for network or deployment boundaries`,
    examples: [],
  },
};
