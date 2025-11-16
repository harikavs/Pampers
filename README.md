# Pampers-campaign

## Our system reduces campaign creation time from 3-5 days to under 60 seconds. These are MASSIVE benefits for P & G as it reduces the manual workload, consistent quality across countries, faster experimentation, Better performance through AI insights, and Empowerment for small local teams who lack CRM specialists. 

Pampers Campaign Copilot transforms a marketer’s one-line brief into a fully built, multi-country Braze campaign with copy, journey, QA, and hypercare insights — all powered by a modular TypeScript AI engine and deployable on ARM infrastructure.

## Technical Architecture

Frontend: React + Vite + TypeScript

React with TypeScript

Tailwind + shadcn/ui for polished UI

Pages for Chat, Simulation, QA, Go-Live, Hypercare

API client under src/lib/api.ts

Componentized dashboard (cards, charts, inputs, sections)

Built with Cursor & Lovable for rapid iteration

Backend: Node.js + Express + TypeScript

The core AI engine lives in backend/ai/:

campaignInterpreter.ts → converts brief → spec

journeyBuilder.ts → builds multi-step cross-market flow

copyGenerator.ts → generates localized channel copy

qaEngine.ts → checks campaign quality

index.ts → orchestrates entire pipeline

Endpoints:

POST /api/chat → returns spec + journey + copy + QA

POST /api/go-live → simulates Braze launch

GET /api/hypercare/:id → returns metrics + AI insights

Braze Integration

Mock Braze client following real REST API schema

EU-01 cluster-compatible endpoint structure

Demonstrates how P&G could fully automate Braze Canvas creation
