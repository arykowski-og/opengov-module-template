---
description: "OpenGov infrastructure architecture and platform services context"
globs: []
alwaysApply: false
---

# OpenGov Infrastructure Architecture

This rule provides context about the infrastructure and platform services that power OpenGov applications.

## Platform Overview

OpenGov runs on AWS with Kubernetes orchestration, using infrastructure-as-code practices.

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS Cloud                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   EKS       │  │   RDS       │  │   Data Platform         │  │
│  │  ┌───────┐  │  │  PostgreSQL │  │  ┌─────────┐ ┌───────┐  │  │
│  │  │NestJS │  │  │             │  │  │Redshift │ │Metabase│  │  │
│  │  │ APIs  │  │  └─────────────┘  │  └─────────┘ └───────┘  │  │
│  │  ├───────┤  │                   │                         │  │
│  │  │Spring │  │  ┌─────────────┐  └─────────────────────────┘  │
│  │  │ Batch │  │  │   Redis     │                               │
│  │  ├───────┤  │  │   Cache     │  ┌─────────────────────────┐  │
│  │  │React  │  │  └─────────────┘  │   Storage               │  │
│  │  │ SSR   │  │                   │  ┌─────────┐             │  │
│  │  └───────┘  │  ┌─────────────┐  │  │   S3    │             │  │
│  └─────────────┘  │   Kafka     │  │  │ Buckets │             │  │
│                   │   Events    │  │  └─────────┘             │  │
│  ┌─────────────┐  └─────────────┘  └─────────────────────────┘  │
│  │  Temporal   │                                                │
│  │  Workflows  │                                                │
│  └─────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Core Services

### AWS EKS (Kubernetes)
- Container orchestration for all services
- Auto-scaling based on load
- Service mesh for inter-service communication
- Managed by Terraform

### Managed PostgreSQL (RDS)
- Primary transactional database
- Multi-AZ deployment for high availability
- Read replicas for reporting queries

### Redis
- Session storage
- Application caching
- Rate limiting
- Pub/sub for real-time features

### Kafka
- Event streaming platform
- Async communication between services
- Event sourcing patterns
- CDC (Change Data Capture) from databases

### Temporal
- Durable workflow orchestration
- Long-running business processes
- Retry logic and failure handling
- Saga pattern implementation

## Data Platform

### S3
- Document and file storage
- Static asset hosting
- Data lake storage
- Backup storage

### Redshift
- Data warehouse for analytics
- Historical data aggregation
- Reporting data mart

### Metabase
- Business intelligence dashboards
- Self-service analytics
- Embedded analytics in applications

## Infrastructure as Code

### Terraform
All infrastructure is managed via Terraform:
- VPC and networking
- EKS cluster configuration
- RDS instances
- S3 buckets
- IAM roles and policies

## Frontend Integration Points

When building frontend features, consider these backend capabilities:

### File Uploads
- Use pre-signed S3 URLs for direct uploads
- API returns upload URL, frontend uploads directly to S3

### Real-time Updates
- WebSocket connections via API gateway
- Redis pub/sub for broadcasting
- Consider polling for simpler cases

### Long-running Operations
- Temporal workflows for complex processes
- Poll for status or use WebSocket notifications
- Display progress indicators in UI

### Caching
- API responses cached in Redis
- ETags for client-side cache validation
- Consider stale-while-revalidate patterns
