export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface OrderDetailsData {
  items: OrderItem[];
  totalAmount: number;
}

export interface VapiConfig {
  publicKey: string;
  assistantId: string;
}

export interface SimliConfig {
  apiKey: string;
  faceId: string;
}

export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting", 
  CONNECTED = "connected",
  ERROR = "error",
}

export enum OrderStatus {
  NONE = "none",
  IN_PROGRESS = "in-progress", 
  COMPLETED = "completed",
}

// VAPI Message Types
export interface VapiMessage {
  type: string;
  [key: string]: any;
}

export interface VapiFunctionCall {
  name: string;
  parameters: any;
}

export interface VapiCallStatus {
  status: 'connecting' | 'connected' | 'ended' | 'error';
}
