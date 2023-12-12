import envVar from 'env-var';

export const keyboardInputSocket = {
  host: envVar.get('KEYBOARD_INPUT_SOCKET_HOST').required().asString(),
  port: envVar.get('KEYBOARD_INPUT_SOCKET_PORT').required().asPortNumber(),
};
// 2 minutes
export const minDelay = 1000 * 60 * 2;
// 14 minutes
export const maxDelay = 1000 * 60 * 14;
export const movementKeys = ['z', 'q', 's', 'd'];
