import { EventEmitter } from 'events'

export interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

export interface JsonRpcRequest {
  id: string | undefined
  jsonrpc: '2.0'
  method: string
  params?: Array<any>
}

export interface JsonRpcResponse {
  id: string | undefined
  jsonrpc: '2.0'
  method: string
  result?: unknown
  error?: Error
}

export type JsonRpcCallback = (
  error: Error,
  response: JsonRpcResponse,
) => unknown

export interface EIP1193Provider extends EventEmitter {
  request: (args: RequestArguments) => Promise<unknown>
  sendAsync: (payload: JsonRpcRequest, callback: JsonRpcCallback) => void
}

export enum EIP1193Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ACCOUNTS_CHANGED = 'accountsChanged',
  CHAIN_CHANGED = 'chainChanged',
}

export type InitialData = {
  account: string
  chainId: number
}
