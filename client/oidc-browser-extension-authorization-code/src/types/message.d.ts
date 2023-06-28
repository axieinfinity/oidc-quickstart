declare type EXTMessageType = 'CHANGE_COLOR' | 'login' | 'response_login'

declare type EXTMessage<T = any> = {
  type: EXTMessageType
  data?: T
}
