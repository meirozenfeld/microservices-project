# Architecture Overview

## Architectural Style
The system is designed using a microservices architecture.

Each service:
- Owns its data
- Is independently deployable
- Communicates via REST and events

## Communication Patterns
- Synchronous communication using HTTP (REST)
- Asynchronous communication using Kafka events

## Design Principles
- Database per service
- Loose coupling
- High cohesion
- Failure isolation
