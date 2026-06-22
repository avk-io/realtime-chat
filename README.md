# Private Chat — Self-Destructing Chat Room

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Blue)
![Redis](https://img.shields.io/badge/Redis-Upstash-red)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black)

A production-ready real-time private chat application where rooms automatically self-destruct after 10 minutes.

Built with Next.js, Elysia.js, Upstash Redis, Upstash Realtime, TypeScript, and deployed on Vercel.

## Live Demo

**Live Application:** https://realtime-chat-eosin-rho.vercel.app

## Features

* Real-time messaging between two participants
* Automatic room destruction after 10 minutes
* Manual room destruction by either participant
* Unique shareable room links
* Middleware-enforced 2-user room limit
* Cookie-based session authentication
* Bot and crawler detection
* Redis TTL-based automatic cleanup
* Production deployment on Vercel

## Tech Stack

### Frontend

* Next.js
* TypeScript

### Backend

* Elysia.js
* Next.js API Routes

### Infrastructure

* Vercel
* Upstash Redis
* Upstash Realtime

## Architecture Overview

### Room Lifecycle

1. User creates a room.
2. A unique room ID is generated.
3. Room metadata is stored in Redis with a 10-minute TTL.
4. A shareable room link is generated.
5. A second participant joins.
6. Messages are exchanged in real time.
7. Room is automatically destroyed after 10 minutes or manually destroyed by either participant.

### Authentication

When a participant joins a room, the backend assigns a unique session token through secure cookies.

No traditional account creation is required.

### Access Control

Custom Next.js middleware validates:

* Room existence
* Room capacity
* Session state

Unauthorized requests are blocked before the chat page loads.

### Real-Time Messaging

Messages are delivered through Upstash Realtime, enabling instant communication without polling.

Temporary message history is stored in Redis and expires alongside the room.

## Production Challenges Solved

### Bot & Crawler Protection

Messaging apps often generate link previews by automatically visiting shared URLs.

Special handling prevents crawlers from:

* Consuming room slots
* Creating sessions
* Modifying room state

Examples include:

* WhatsApp Preview Bot
* Telegram Preview Bot
* Social Media Crawlers

### Next.js Internal Request Filtering

React Server Component requests and framework-generated requests are filtered to prevent accidental double registration of room participants.

### Automatic Cleanup

Instead of relying on scheduled cleanup jobs, Redis TTL automatically expires rooms and associated message history.

Benefits:

* Reduced operational complexity
* No cron jobs
* Automatic cleanup
* Reliable expiration behavior

## Local Development

### Clone Repository

```bash
git clone https://github.com/avk-io/realtime-chat.git
cd realtime-chat
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
UPSTASH_REALTIME_URL=your_realtime_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Future Improvements

* End-to-end encryption
* Read receipts
* Typing indicators
* Room passwords
* File sharing
* Group chat support
* Message reactions

## Lessons Learned

Building this project required solving real-world engineering challenges including:

* Real-time communication in a serverless environment
* Middleware-based access control
* Redis TTL strategies
* Session management without user accounts
* Bot and crawler handling
* Next.js request lifecycle debugging
* Production deployment on Vercel

## Deployment

The application is deployed on Vercel and uses:

* Vercel for hosting
* Upstash Redis for temporary room storage
* Upstash Realtime for live message delivery

GitHub: https://github.com/avk-io
