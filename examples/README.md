# AIGP Example Gallery

This directory contains 50+ example diagrams demonstrating the AIGP (AI Graphic Protocol) format across various diagram types. Each example is a complete, valid AIGP document that can be validated, converted, and rendered.

## 📊 Diagram Categories

### Flowcharts (14 examples)
Process flows, workflows, and decision trees.

- **ci-cd-pipeline** - Automated build, test, and deployment workflow
- **error-handling** - Application error handling and recovery process
- **data-pipeline** - ETL data processing workflow
- **order-fulfillment** - E-commerce order processing workflow
- **incident-response** - Cybersecurity incident handling workflow
- **customer-onboarding** - New customer registration and setup process
- **content-moderation** - User-generated content review process
- **backup-recovery** - Data backup and disaster recovery workflow
- **ab-testing** - Feature experiment and rollout process
- **ml-training** - Machine learning training pipeline
- **user-authentication** - User authentication with OAuth and 2FA
- **bug-triage** - Software bug reporting and prioritization
- **docker-build** - Container image build pipeline
- **feature-flag** - Progressive feature deployment with flags

### Sequence Diagrams (6 examples)
Interaction flows and message sequences between actors.

- **api-request** - REST API request flow with authentication
- **payment-processing** - Secure payment transaction sequence
- **oauth-flow** - OAuth 2.0 authorization flow
- **microservices-saga** - Distributed transaction saga pattern
- **websocket-connection** - Real-time bidirectional communication setup
- **graphql-query** - GraphQL request processing flow

### Class Diagrams (5 examples)
Object-oriented design and relationships.

- **e-commerce-domain** - Core domain entities for online shopping
- **blog-system** - Content management system class structure
- **game-engine** - Basic 2D game engine class hierarchy
- **authentication-system** - User authentication and authorization classes
- **notification-system** - Multi-channel notification delivery

### Entity-Relationship Diagrams (4 examples)
Database schemas and data models.

- **social-network** - Social media platform database schema
- **library-system** - Library management database design
- **hospital-management** - Healthcare management database schema
- **hotel-booking** - Hotel reservation database design

### Architecture Diagrams (5 examples)
System architecture and component relationships.

- **ecommerce-architecture** - E-commerce platform system architecture
- **microservices-architecture** - Cloud-native microservices deployment
- **three-tier-webapp** - Traditional web application architecture
- **event-driven-architecture** - Event streaming microservices
- **serverless-architecture** - AWS Lambda-based serverless system

### State Machines (3 examples)
State transitions and lifecycle management.

- **order-states** - E-commerce order lifecycle states
- **connection-states** - TCP connection state machine
- **user-session** - Web application session lifecycle

### Organization Charts (2 examples)
Hierarchical structures and reporting relationships.

- **company-structure** - Corporate hierarchy structure
- **engineering-team** - Software engineering organization

### BPMN Diagrams (2 examples)
Business process modeling notation workflows.

- **loan-approval** - Bank loan application BPMN workflow
- **expense-approval** - Employee expense claim approval workflow

### Mind Maps (2 examples)
Hierarchical idea organization.

- **product-features** - Feature ideation mind map
- **marketing-strategy** - Digital marketing channels and tactics

### Network Diagrams (2 examples)
Network topology and infrastructure.

- **datacenter-topology** - Enterprise network infrastructure
- **home-network** - Residential network topology

### Timeline Diagrams (2 examples)
Chronological event sequences.

- **project-milestones** - Software project milestone timeline
- **product-roadmap** - Annual product development timeline

### Kanban Boards (2 examples)
Task management and workflow boards.

- **sprint-board** - Agile sprint task board
- **bug-tracking-board** - Bug resolution workflow board

### Sankey Diagrams (2 examples)
Flow and distribution visualization.

- **energy-flow** - Energy distribution and consumption flow
- **website-traffic** - Traffic source flow analysis

### Funnel Diagrams (1 example)
Conversion and progression stages.

- **sales-funnel** - Customer journey conversion stages

## 🚀 Usage

### Validate an example
```bash
aigp validate examples/flowchart/ci-cd-pipeline.json
```

### Convert to Mermaid
```bash
aigp export examples/sequence/api-request.json --format mermaid
```

### View with CLI
```bash
aigp examples/architecture/microservices-architecture.json
```

## 📝 Example Structure

Each example follows the AIGP standard format:

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "Example Title",
    "description": "Brief description",
    "author": "AIGP Examples",
    "tags": ["tag1", "tag2"]
  },
  "graph": {
    "nodes": [...],
    "edges": [...]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB"
  }
}
```

## 🎯 Use Cases

These examples demonstrate AIGP for:

- **Software Engineering**: CI/CD pipelines, architecture diagrams, sequence flows
- **Business Processes**: BPMN workflows, approval processes, organizational charts
- **Data Modeling**: ER diagrams, class diagrams, database schemas
- **System Design**: Network topology, microservices, serverless architectures
- **Project Management**: Kanban boards, timelines, roadmaps
- **Analytics**: Sankey flows, funnels, conversion tracking
- **AI/ML**: Training pipelines, data processing workflows

## 📖 Learning Path

1. **Start with Flowcharts**: Simple nodes and edges (`flowchart/ci-cd-pipeline.json`)
2. **Try Sequence Diagrams**: Time-based interactions (`sequence/api-request.json`)
3. **Explore Class Diagrams**: Relationships and inheritance (`class/e-commerce-domain.json`)
4. **Study Architecture**: Complex systems (`architecture/microservices-architecture.json`)
5. **Advanced Visualizations**: Sankey, funnel, timeline diagrams

## 🤝 Contributing

Add your own examples following the existing structure:

1. Create a JSON file in the appropriate type directory
2. Follow the AIGP schema format (see examples above)
3. Validate the output: `aigp validate examples/your-type/your-example.json`
4. Submit a pull request

## 📚 Resources

- [AIGP Protocol Specification](../docs/PROTOCOL.md)
- [Quickstart Guide](../docs/QUICKSTART.md)
- [AIGP GitHub Repository](https://github.com/aigp/aigp)

---

**Total Examples**: 52 diagrams across 14 diagram types
**Generated**: 2026-03-09
**Version**: 1.0.0
