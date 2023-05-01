import { configureAbly, useChannel } from '@ably-labs/react-hooks';

import type { Types } from 'ably';

let isAblyConfigured = false;

export type UseRealtimeParams = {
  clientId: string;
  apiKey: string;
  channelName: string;
  onMessage: (message: Types.Message) => void;
};

export function useRealtime({ clientId, apiKey, channelName, onMessage }: UseRealtimeParams) {
  if (!isAblyConfigured) {
    configureAbly({ key: apiKey, clientId });
    isAblyConfigured = true;
  }

  const [realtimeChannel] = useChannel(channelName, channelName, onMessage);

  const sendMessage = (data: unknown) => realtimeChannel.publish(channelName, data);

  return {
    realtimeChannel,
    sendMessage,
  };
}
