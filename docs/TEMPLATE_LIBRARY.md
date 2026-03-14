# AIGP Template Library

## Overview

Comprehensive collection of ready-to-use diagram templates for common use cases. Each template includes example data, visual preview, and customization guide.

---

## Software Engineering

### 1. Microservices Architecture

**File**: `templates/microservices-architecture.json`

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "network",
  "metadata": {
    "title": "Microservices Architecture",
    "description": "Template for designing microservices architecture",
    "tags": ["architecture", "microservices", "backend"],
    "author": "AIGP Community",
    "category": "software-engineering"
  },
  "graph": {
    "nodes": [
      {
        "id": "api-gateway",
        "type": "server",
        "label": "API Gateway",
        "data": {
          "technology": "Kong",
          "port": 8000,
          "description": "Entry point for all API requests"
        }
      },
      {
        "id": "auth-service",
        "type": "service",
        "label": "Auth Service",
        "data": {
          "technology": "Node.js",
          "port": 3001,
          "database": "Redis"
        }
      },
      {
        "id": "user-service",
        "type": "service",
        "label": "User Service",
        "data": {
          "technology": "Node.js",
          "port": 3002,
          "database": "PostgreSQL"
        }
      },
      {
        "id": "product-service",
        "type": "service",
        "label": "Product Service",
        "data": {
          "technology": "Go",
          "port": 3003,
          "database": "MongoDB"
        }
      },
      {
        "id": "order-service",
        "type": "service",
        "label": "Order Service",
        "data": {
          "technology": "Python",
          "port": 3004,
          "database": "PostgreSQL"
        }
      },
      {
        "id": "message-queue",
        "type": "queue",
        "label": "Message Queue",
        "data": {
          "technology": "RabbitMQ",
          "port": 5672
        }
      },
      {
        "id": "cache",
        "type": "cache",
        "label": "Redis Cache",
        "data": {
          "technology": "Redis",
          "port": 6379
        }
      },
      {
        "id": "postgres",
        "type": "database",
        "label": "PostgreSQL",
        "data": {
          "type": "relational",
          "port": 5432
        }
      },
      {
        "id": "mongodb",
        "type": "database",
        "label": "MongoDB",
        "data": {
          "type": "document",
          "port": 27017
        }
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "api-gateway",
        "target": "auth-service",
        "type": "http",
        "label": "Authenticate"
      },
      {
        "id": "e2",
        "source": "api-gateway",
        "target": "user-service",
        "type": "http",
        "label": "User API"
      },
      {
        "id": "e3",
        "source": "api-gateway",
        "target": "product-service",
        "type": "http",
        "label": "Product API"
      },
      {
        "id": "e4",
        "source": "api-gateway",
        "target": "order-service",
        "type": "http",
        "label": "Order API"
      },
      {
        "id": "e5",
        "source": "auth-service",
        "target": "cache",
        "type": "data-flow",
        "label": "Session Cache"
      },
      {
        "id": "e6",
        "source": "user-service",
        "target": "postgres",
        "type": "data-flow",
        "label": "User Data"
      },
      {
        "id": "e7",
        "source": "product-service",
        "target": "mongodb",
        "type": "data-flow",
        "label": "Product Data"
      },
      {
        "id": "e8",
        "source": "order-service",
        "target": "postgres",
        "type": "data-flow",
        "label": "Order Data"
      },
      {
        "id": "e9",
        "source": "order-service",
        "target": "message-queue",
        "type": "event",
        "label": "Order Events"
      },
      {
        "id": "e10",
        "source": "message-queue",
        "target": "user-service",
        "type": "event",
        "label": "Notifications"
      }
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB"
  }
}
```

**Customization Guide:**

Replace these elements:
- Service names and technologies
- Database types (SQL, NoSQL, cache)
- Communication patterns (HTTP, gRPC, message queue)
- Add monitoring, logging services
- Add frontend applications

---

### 2. CI/CD Pipeline

**File**: `templates/cicd-pipeline.json`

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "CI/CD Pipeline",
    "description": "Continuous Integration and Deployment pipeline",
    "tags": ["devops", "cicd", "automation"],
    "category": "software-engineering"
  },
  "graph": {
    "nodes": [
      {
        "id": "commit",
        "type": "start",
        "label": "Code Commit",
        "data": { "trigger": "git push" }
      },
      {
        "id": "checkout",
        "type": "process",
        "label": "Checkout Code",
        "data": { "action": "git clone" }
      },
      {
        "id": "install",
        "type": "process",
        "label": "Install Dependencies",
        "data": { "action": "npm install" }
      },
      {
        "id": "lint",
        "type": "process",
        "label": "Lint Code",
        "data": { "action": "npm run lint" }
      },
      {
        "id": "test",
        "type": "process",
        "label": "Run Tests",
        "data": { "action": "npm test" }
      },
      {
        "id": "test-pass",
        "type": "decision",
        "label": "Tests Pass?",
        "data": {}
      },
      {
        "id": "build",
        "type": "process",
        "label": "Build Application",
        "data": { "action": "npm run build" }
      },
      {
        "id": "docker",
        "type": "process",
        "label": "Build Docker Image",
        "data": { "action": "docker build" }
      },
      {
        "id": "push-registry",
        "type": "process",
        "label": "Push to Registry",
        "data": { "action": "docker push" }
      },
      {
        "id": "deploy-staging",
        "type": "process",
        "label": "Deploy to Staging",
        "data": { "environment": "staging" }
      },
      {
        "id": "integration-tests",
        "type": "process",
        "label": "Integration Tests",
        "data": { "action": "npm run test:integration" }
      },
      {
        "id": "approve",
        "type": "decision",
        "label": "Manual Approval?",
        "data": {}
      },
      {
        "id": "deploy-prod",
        "type": "process",
        "label": "Deploy to Production",
        "data": { "environment": "production" }
      },
      {
        "id": "notify-success",
        "type": "end",
        "label": "Notify Success",
        "data": { "action": "slack notification" }
      },
      {
        "id": "notify-failure",
        "type": "end",
        "label": "Notify Failure",
        "data": { "action": "slack notification" }
      }
    ],
    "edges": [
      { "id": "e1", "source": "commit", "target": "checkout" },
      { "id": "e2", "source": "checkout", "target": "install" },
      { "id": "e3", "source": "install", "target": "lint" },
      { "id": "e4", "source": "lint", "target": "test" },
      { "id": "e5", "source": "test", "target": "test-pass" },
      { "id": "e6", "source": "test-pass", "target": "build", "label": "Yes" },
      { "id": "e7", "source": "test-pass", "target": "notify-failure", "label": "No" },
      { "id": "e8", "source": "build", "target": "docker" },
      { "id": "e9", "source": "docker", "target": "push-registry" },
      { "id": "e10", "source": "push-registry", "target": "deploy-staging" },
      { "id": "e11", "source": "deploy-staging", "target": "integration-tests" },
      { "id": "e12", "source": "integration-tests", "target": "approve" },
      { "id": "e13", "source": "approve", "target": "deploy-prod", "label": "Approved" },
      { "id": "e14", "source": "approve", "target": "notify-failure", "label": "Rejected" },
      { "id": "e15", "source": "deploy-prod", "target": "notify-success" }
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "TB"
  }
}
```

---

## Business Processes

### 3. Customer Onboarding Flow

**File**: `templates/customer-onboarding.json`

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "Customer Onboarding Flow",
    "description": "SaaS customer onboarding process",
    "tags": ["onboarding", "customer-success", "saas"],
    "category": "business-process"
  },
  "graph": {
    "nodes": [
      { "id": "signup", "type": "start", "label": "Customer Signs Up" },
      { "id": "verify-email", "type": "process", "label": "Verify Email" },
      { "id": "email-verified", "type": "decision", "label": "Email Verified?" },
      { "id": "send-reminder", "type": "process", "label": "Send Reminder Email" },
      { "id": "complete-profile", "type": "process", "label": "Complete Profile" },
      { "id": "choose-plan", "type": "decision", "label": "Choose Plan" },
      { "id": "setup-payment", "type": "process", "label": "Setup Payment" },
      { "id": "trial", "type": "process", "label": "Start Free Trial" },
      { "id": "welcome-email", "type": "process", "label": "Send Welcome Email" },
      { "id": "schedule-demo", "type": "process", "label": "Schedule Demo" },
      { "id": "assign-csm", "type": "process", "label": "Assign Customer Success Manager" },
      { "id": "onboarding-call", "type": "process", "label": "Onboarding Call" },
      { "id": "complete", "type": "end", "label": "Onboarding Complete" }
    ],
    "edges": [
      { "id": "e1", "source": "signup", "target": "verify-email" },
      { "id": "e2", "source": "verify-email", "target": "email-verified" },
      { "id": "e3", "source": "email-verified", "target": "complete-profile", "label": "Yes" },
      { "id": "e4", "source": "email-verified", "target": "send-reminder", "label": "No" },
      { "id": "e5", "source": "send-reminder", "target": "email-verified" },
      { "id": "e6", "source": "complete-profile", "target": "choose-plan" },
      { "id": "e7", "source": "choose-plan", "target": "setup-payment", "label": "Paid Plan" },
      { "id": "e8", "source": "choose-plan", "target": "trial", "label": "Free Trial" },
      { "id": "e9", "source": "setup-payment", "target": "welcome-email" },
      { "id": "e10", "source": "trial", "target": "welcome-email" },
      { "id": "e11", "source": "welcome-email", "target": "schedule-demo" },
      { "id": "e12", "source": "schedule-demo", "target": "assign-csm" },
      { "id": "e13", "source": "assign-csm", "target": "onboarding-call" },
      { "id": "e14", "source": "onboarding-call", "target": "complete" }
    ]
  }
}
```

---

### 4. Order Fulfillment Process

**File**: `templates/order-fulfillment.json`

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "flowchart",
  "metadata": {
    "title": "Order Fulfillment Process",
    "description": "E-commerce order processing workflow",
    "tags": ["ecommerce", "logistics", "fulfillment"],
    "category": "business-process"
  },
  "graph": {
    "nodes": [
      { "id": "order-placed", "type": "start", "label": "Order Placed" },
      { "id": "validate-payment", "type": "process", "label": "Validate Payment" },
      { "id": "payment-ok", "type": "decision", "label": "Payment OK?" },
      { "id": "cancel-order", "type": "end", "label": "Cancel Order" },
      { "id": "check-inventory", "type": "process", "label": "Check Inventory" },
      { "id": "in-stock", "type": "decision", "label": "In Stock?" },
      { "id": "backorder", "type": "process", "label": "Create Backorder" },
      { "id": "pick-items", "type": "process", "label": "Pick Items from Warehouse" },
      { "id": "pack-order", "type": "process", "label": "Pack Order" },
      { "id": "print-label", "type": "process", "label": "Print Shipping Label" },
      { "id": "ship-order", "type": "process", "label": "Ship Order" },
      { "id": "notify-customer", "type": "process", "label": "Notify Customer" },
      { "id": "track-shipment", "type": "process", "label": "Track Shipment" },
      { "id": "delivered", "type": "end", "label": "Order Delivered" }
    ],
    "edges": [
      { "id": "e1", "source": "order-placed", "target": "validate-payment" },
      { "id": "e2", "source": "validate-payment", "target": "payment-ok" },
      { "id": "e3", "source": "payment-ok", "target": "check-inventory", "label": "Yes" },
      { "id": "e4", "source": "payment-ok", "target": "cancel-order", "label": "No" },
      { "id": "e5", "source": "check-inventory", "target": "in-stock" },
      { "id": "e6", "source": "in-stock", "target": "pick-items", "label": "Yes" },
      { "id": "e7", "source": "in-stock", "target": "backorder", "label": "No" },
      { "id": "e8", "source": "backorder", "target": "check-inventory" },
      { "id": "e9", "source": "pick-items", "target": "pack-order" },
      { "id": "e10", "source": "pack-order", "target": "print-label" },
      { "id": "e11", "source": "print-label", "target": "ship-order" },
      { "id": "e12", "source": "ship-order", "target": "notify-customer" },
      { "id": "e13", "source": "notify-customer", "target": "track-shipment" },
      { "id": "e14", "source": "track-shipment", "target": "delivered" }
    ]
  }
}
```

---

## Data Engineering

### 5. ETL Pipeline

**File**: `templates/etl-pipeline.json`

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "data-flow",
  "metadata": {
    "title": "ETL Pipeline",
    "description": "Extract, Transform, Load data pipeline",
    "tags": ["data-engineering", "etl", "data-pipeline"],
    "category": "data-engineering"
  },
  "graph": {
    "nodes": [
      { "id": "source-db", "type": "database", "label": "Source Database" },
      { "id": "source-api", "type": "api", "label": "External API" },
      { "id": "source-files", "type": "storage", "label": "File Storage (S3)" },
      { "id": "extract", "type": "process", "label": "Extract Data" },
      { "id": "validate", "type": "process", "label": "Validate Data" },
      { "id": "transform", "type": "process", "label": "Transform & Clean" },
      { "id": "enrich", "type": "process", "label": "Enrich Data" },
      { "id": "staging", "type": "database", "label": "Staging Database" },
      { "id": "load-dwh", "type": "process", "label": "Load to Data Warehouse" },
      { "id": "data-warehouse", "type": "database", "label": "Data Warehouse" },
      { "id": "create-views", "type": "process", "label": "Create Analytical Views" },
      { "id": "bi-tools", "type": "application", "label": "BI Tools" }
    ],
    "edges": [
      { "id": "e1", "source": "source-db", "target": "extract" },
      { "id": "e2", "source": "source-api", "target": "extract" },
      { "id": "e3", "source": "source-files", "target": "extract" },
      { "id": "e4", "source": "extract", "target": "validate" },
      { "id": "e5", "source": "validate", "target": "transform" },
      { "id": "e6", "source": "transform", "target": "enrich" },
      { "id": "e7", "source": "enrich", "target": "staging" },
      { "id": "e8", "source": "staging", "target": "load-dwh" },
      { "id": "e9", "source": "load-dwh", "target": "data-warehouse" },
      { "id": "e10", "source": "data-warehouse", "target": "create-views" },
      { "id": "e11", "source": "create-views", "target": "bi-tools" }
    ]
  },
  "layout": {
    "algorithm": "hierarchical",
    "direction": "LR"
  }
}
```

---

## Project Management

### 6. Product Launch Timeline

**File**: `templates/product-launch-timeline.json`

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "timeline",
  "metadata": {
    "title": "Product Launch Timeline",
    "description": "3-month product launch schedule",
    "tags": ["project-management", "timeline", "product-launch"],
    "category": "project-management",
    "startDate": "2027-01-01",
    "endDate": "2027-03-31"
  },
  "graph": {
    "nodes": [
      {
        "id": "kickoff",
        "type": "milestone",
        "label": "Project Kickoff",
        "data": {
          "date": "2027-01-05",
          "status": "planned",
          "assignee": "PM Team"
        }
      },
      {
        "id": "research",
        "type": "phase",
        "label": "Market Research",
        "data": {
          "date": "2027-01-06",
          "duration": 14,
          "status": "planned",
          "assignee": "Research Team"
        }
      },
      {
        "id": "design",
        "type": "phase",
        "label": "Design Phase",
        "data": {
          "date": "2027-01-20",
          "duration": 21,
          "status": "planned",
          "assignee": "Design Team"
        }
      },
      {
        "id": "development",
        "type": "phase",
        "label": "Development",
        "data": {
          "date": "2027-02-10",
          "duration": 30,
          "status": "planned",
          "assignee": "Engineering"
        }
      },
      {
        "id": "beta",
        "type": "milestone",
        "label": "Beta Release",
        "data": {
          "date": "2027-03-01",
          "status": "planned",
          "priority": "high"
        }
      },
      {
        "id": "marketing",
        "type": "phase",
        "label": "Marketing Campaign",
        "data": {
          "date": "2027-03-05",
          "duration": 17,
          "status": "planned",
          "assignee": "Marketing"
        }
      },
      {
        "id": "launch",
        "type": "deadline",
        "label": "Public Launch",
        "data": {
          "date": "2027-03-22",
          "status": "planned",
          "priority": "critical"
        }
      }
    ],
    "edges": [
      { "id": "e1", "source": "kickoff", "target": "research", "type": "depends-on" },
      { "id": "e2", "source": "research", "target": "design", "type": "depends-on" },
      { "id": "e3", "source": "design", "target": "development", "type": "depends-on" },
      { "id": "e4", "source": "development", "target": "beta", "type": "depends-on" },
      { "id": "e5", "source": "beta", "target": "marketing", "type": "depends-on" },
      { "id": "e6", "source": "marketing", "target": "launch", "type": "depends-on" }
    ]
  },
  "layout": {
    "algorithm": "timeline-horizontal"
  }
}
```

---

## Infrastructure

### 7. AWS Cloud Architecture

**File**: `templates/aws-architecture.json`

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "network",
  "metadata": {
    "title": "AWS Cloud Architecture",
    "description": "Scalable web application on AWS",
    "tags": ["aws", "cloud", "infrastructure"],
    "category": "infrastructure"
  },
  "graph": {
    "nodes": [
      { "id": "route53", "type": "dns", "label": "Route 53" },
      { "id": "cloudfront", "type": "cdn", "label": "CloudFront CDN" },
      { "id": "alb", "type": "load-balancer", "label": "Application Load Balancer" },
      { "id": "ec2-1", "type": "server", "label": "EC2 Instance 1" },
      { "id": "ec2-2", "type": "server", "label": "EC2 Instance 2" },
      { "id": "rds", "type": "database", "label": "RDS PostgreSQL" },
      { "id": "elasticache", "type": "cache", "label": "ElastiCache Redis" },
      { "id": "s3", "type": "storage", "label": "S3 Bucket" },
      { "id": "lambda", "type": "function", "label": "Lambda Functions" },
      { "id": "sqs", "type": "queue", "label": "SQS Queue" },
      { "id": "cloudwatch", "type": "monitoring", "label": "CloudWatch" }
    ],
    "edges": [
      { "id": "e1", "source": "route53", "target": "cloudfront" },
      { "id": "e2", "source": "cloudfront", "target": "alb" },
      { "id": "e3", "source": "alb", "target": "ec2-1" },
      { "id": "e4", "source": "alb", "target": "ec2-2" },
      { "id": "e5", "source": "ec2-1", "target": "rds" },
      { "id": "e6", "source": "ec2-2", "target": "rds" },
      { "id": "e7", "source": "ec2-1", "target": "elasticache" },
      { "id": "e8", "source": "ec2-2", "target": "elasticache" },
      { "id": "e9", "source": "ec2-1", "target": "s3" },
      { "id": "e10", "source": "ec2-2", "target": "s3" },
      { "id": "e11", "source": "ec2-1", "target": "sqs" },
      { "id": "e12", "source": "sqs", "target": "lambda" },
      { "id": "e13", "source": "cloudwatch", "target": "alb", "type": "monitoring" },
      { "id": "e14", "source": "cloudwatch", "target": "ec2-1", "type": "monitoring" },
      { "id": "e15", "source": "cloudwatch", "target": "rds", "type": "monitoring" }
    ]
  }
}
```

---

## Database Design

### 8. E-Commerce Database Schema

**File**: `templates/ecommerce-database-er.json`

```json
{
  "schema": "https://aigraphia.com/schema/v1",
  "version": "1.0.0",
  "type": "er-diagram",
  "metadata": {
    "title": "E-Commerce Database Schema",
    "description": "Entity-Relationship diagram for e-commerce platform",
    "tags": ["database", "er-diagram", "ecommerce"],
    "category": "database-design"
  },
  "graph": {
    "nodes": [
      {
        "id": "users",
        "type": "entity",
        "label": "Users",
        "data": {
          "attributes": [
            { "name": "id", "type": "INT", "primaryKey": true },
            { "name": "email", "type": "VARCHAR(255)", "unique": true },
            { "name": "password", "type": "VARCHAR(255)" },
            { "name": "name", "type": "VARCHAR(100)" },
            { "name": "created_at", "type": "TIMESTAMP" }
          ]
        }
      },
      {
        "id": "products",
        "type": "entity",
        "label": "Products",
        "data": {
          "attributes": [
            { "name": "id", "type": "INT", "primaryKey": true },
            { "name": "name", "type": "VARCHAR(255)" },
            { "name": "description", "type": "TEXT" },
            { "name": "price", "type": "DECIMAL(10,2)" },
            { "name": "stock", "type": "INT" },
            { "name": "category_id", "type": "INT", "foreignKey": "categories.id" }
          ]
        }
      },
      {
        "id": "categories",
        "type": "entity",
        "label": "Categories",
        "data": {
          "attributes": [
            { "name": "id", "type": "INT", "primaryKey": true },
            { "name": "name", "type": "VARCHAR(100)" },
            { "name": "parent_id", "type": "INT", "nullable": true }
          ]
        }
      },
      {
        "id": "orders",
        "type": "entity",
        "label": "Orders",
        "data": {
          "attributes": [
            { "name": "id", "type": "INT", "primaryKey": true },
            { "name": "user_id", "type": "INT", "foreignKey": "users.id" },
            { "name": "status", "type": "VARCHAR(50)" },
            { "name": "total", "type": "DECIMAL(10,2)" },
            { "name": "created_at", "type": "TIMESTAMP" }
          ]
        }
      },
      {
        "id": "order_items",
        "type": "entity",
        "label": "Order Items",
        "data": {
          "attributes": [
            { "name": "id", "type": "INT", "primaryKey": true },
            { "name": "order_id", "type": "INT", "foreignKey": "orders.id" },
            { "name": "product_id", "type": "INT", "foreignKey": "products.id" },
            { "name": "quantity", "type": "INT" },
            { "name": "price", "type": "DECIMAL(10,2)" }
          ]
        }
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "products",
        "target": "categories",
        "type": "many-to-one",
        "label": "belongs to"
      },
      {
        "id": "e2",
        "source": "orders",
        "target": "users",
        "type": "many-to-one",
        "label": "placed by"
      },
      {
        "id": "e3",
        "source": "order_items",
        "target": "orders",
        "type": "many-to-one",
        "label": "belongs to"
      },
      {
        "id": "e4",
        "source": "order_items",
        "target": "products",
        "type": "many-to-one",
        "label": "contains"
      }
    ]
  }
}
```

---

## Template Categories

| Category | Templates | Use Cases |
|----------|-----------|-----------|
| **Software Engineering** | 8 templates | Architectures, APIs, deployment |
| **Business Processes** | 12 templates | Onboarding, sales, support |
| **Data Engineering** | 6 templates | ETL, pipelines, warehouses |
| **Project Management** | 10 templates | Timelines, roadmaps, sprints |
| **Infrastructure** | 7 templates | Cloud, networking, DevOps |
| **Database Design** | 5 templates | ER diagrams, schemas |
| **AI/ML Workflows** | 4 templates | Training, inference, MLOps |
| **Security** | 3 templates | Auth flows, compliance |

---

## Usage Guide

### 1. Using Templates in CLI

```bash
# List available templates
aigp templates list

# Create diagram from template
aigp create --template microservices-architecture

# Customize template
aigp create --template microservices-architecture --customize
```

### 2. Using Templates in Web App

```typescript
import { loadTemplate } from '@aigp/templates';

// Load template
const template = await loadTemplate('microservices-architecture');

// Customize
template.metadata.title = 'My Microservices';
template.graph.nodes.push({
  id: 'payment-service',
  type: 'service',
  label: 'Payment Service'
});

// Render
render(template, container);
```

### 3. Using Templates in React

```tsx
import { DiagramEditor, TemplateLibrary } from '@aigp/react';

function App() {
  const [diagram, setDiagram] = useState(null);
  const [showTemplates, setShowTemplates] = useState(true);

  return (
    <div>
      {showTemplates && (
        <TemplateLibrary
          onSelect={(template) => {
            setDiagram(template);
            setShowTemplates(false);
          }}
        />
      )}

      {diagram && (
        <DiagramEditor
          diagram={diagram}
          onChange={setDiagram}
        />
      )}
    </div>
  );
}
```

---

## Customization Tips

### 1. Modify Node Types

```javascript
// Change service technology
template.graph.nodes.find(n => n.id === 'auth-service').data.technology = 'Go';
```

### 2. Add New Nodes

```javascript
template.graph.nodes.push({
  id: 'new-service',
  type: 'service',
  label: 'New Service',
  data: { technology: 'Rust', port: 3005 }
});
```

### 3. Update Connections

```javascript
template.graph.edges.push({
  id: 'e99',
  source: 'api-gateway',
  target: 'new-service',
  type: 'http'
});
```

### 4. Change Layout

```javascript
template.layout = {
  algorithm: 'force-directed',
  iterations: 100
};
```

---

## Contributing Templates

### Submission Process

1. **Create Template**: Follow AIGP schema
2. **Add Metadata**: Include title, description, tags, category
3. **Provide Example**: Include customization guide
4. **Submit PR**: https://github.com/aigp/templates

### Quality Criteria

✅ Valid AIGP schema
✅ Clear, descriptive labels
✅ Realistic example data
✅ Customization guide included
✅ Visual preview (SVG/PNG)
✅ Appropriate layout applied

---

## Template Preview Gallery

Visit https://aigp.dev/templates to browse all templates with interactive previews.

---

## Resources

- Template Repository: https://github.com/aigp/templates
- Template API: https://aigp.dev/api/templates
- Submission Guide: https://aigp.dev/docs/template-submission
- Community Templates: https://aigp.dev/community/templates
