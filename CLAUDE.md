# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered drive-thru application called "Dr. Donut Drive-Thru" that integrates VAPI (Voice AI Platform) with Simli Avatar technology. The system allows customers to place orders using natural voice conversations with a realistic AI avatar.

## Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Voice AI**: VAPI Web SDK (@vapi-ai/web) for speech-to-text/text-to-speech
- **Avatar**: Simli Client SDK for realistic lip-sync avatar
- **Styling**: Tailwind CSS with custom animations

## Development Commands

```bash
# Development
npm run dev                # Start development server on localhost:3000
npm run build             # Build for production
npm start                 # Start production server

# Quality Assurance
npm run lint              # Run ESLint
npm run type-check        # TypeScript type checking (no emit)

# Testing & Debugging
npm run setup-check       # Check environment configuration
npm run test-complete     # Run complete system test
npm run clean             # Clear Next.js cache
```

## Architecture Overview

### Core Components
- **DriveThru.tsx**: Main application orchestrator, manages avatar state and call flow
- **SimliAvatar.tsx**: Handles Simli avatar integration and video/audio streams
- **useVapi.ts**: Custom hook managing VAPI connection, events, and function calls
- **OrderDetails.tsx**: Real-time order display and management UI

### Key Integration Points

**VAPI Function Calling**: The system uses VAPI's function calling feature to update orders in real-time:
- VAPI calls the `updateOrder` function when customers add/modify items
- Webhook at `/api/vapi/route.ts` processes function calls
- Orders are accumulated in `window.currentOrder` global state
- UI updates via custom events (`orderDetailsUpdated`)

**Avatar-Voice Synchronization**: 
- Simli avatar provides lip-sync based on VAPI audio output
- Static avatar mode when voice is inactive
- Avatar state transitions: `static` → `active` → `ended`

**Event-Driven Architecture**: Uses browser custom events for component communication:
- `orderDetailsUpdated`: Updates order display
- `addNotification`: Shows user notifications
- Global event debugging enabled in production via `app/layout.tsx`

### Configuration System

Environment variables are centralized in `lib/config.ts` with validation:
- VAPI: `NEXT_PUBLIC_VAPI_PUBLIC_KEY`, `NEXT_PUBLIC_VAPI_ASSISTANT_ID` 
- Simli: `NEXT_PUBLIC_SIMLI_API_KEY`, `NEXT_PUBLIC_SIMLI_FACE_ID`
- Use `validateConfig()` to check required environment variables

### Menu System

Products are defined in `lib/menuProducts.ts` with structured data including:
- Price information for VAPI function calls
- Keywords for voice recognition
- Categories (dona/bebida) for UI organization

## Development Notes

**Order Processing Logic**: Orders accumulate in global state (`window.currentOrder`) rather than replacing. The `addToCart` function in `useVapi.ts` handles item deduplication and quantity updates.

**Debug Mode**: Extensive console logging is enabled. Check browser console for:
- VAPI connection events
- Function call processing  
- Order state changes
- Avatar state transitions

**Testing**: Multiple test scripts exist for debugging specific flows (test-*.js files). Use `npm run test-complete` for full system validation.

**Static Files**: Avatar images and menu item images are stored in `/public/images/` and referenced via absolute paths.

## VAPI Assistant Configuration

The VAPI assistant requires the `updateOrder` function with this schema:
```json
{
  "name": "updateOrder",
  "parameters": {
    "type": "object", 
    "properties": {
      "orderDetailsData": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "quantity": {"type": "number"},
            "price": {"type": "number"},
            "specialInstructions": {"type": "string"}
          }
        }
      }
    }
  }
}
```

## Common Issues

- **Avatar not loading**: Verify Simli API key and Face ID in environment variables
- **Voice not working**: Check VAPI public key, assistant ID, and microphone permissions  
- **Orders not updating**: Ensure VAPI function calling is configured correctly and webhook is accessible
- **Environment validation**: Run `npm run setup-check` to verify all required keys are present