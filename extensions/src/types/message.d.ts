declare type EXTMessageType = 'CHANGE_COLOR' | 'login';

declare type EXTMessage<T = any> = {
    type: EXTMessageType;
    data?: T;
};
