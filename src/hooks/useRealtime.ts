import { supabasePublic } from '@/supabase-public';

import { RealtimeChannel } from '@supabase/supabase-js';
import { useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';

export type UseRealtimeParams = {
  channelName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessage: (message: any) => void;
};

export function useRealtime({ channelName, onMessage }: UseRealtimeParams) {
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffectOnce(() => {
    const subscription = supabasePublic
      .channel(channelName, {
        config: {
          broadcast: {
            ack: true,
          },
        },
      })
      .on('broadcast', { event: channelName }, (data) => {
        const eventData = data.payload;
        onMessage(eventData);
      })
      .subscribe((status) => {
        setIsConnecting(true);
        if (status === 'SUBSCRIBED') {
          realtimeChannelRef.current = subscription;
          setIsConnecting(false);
        }
      });

    return () => {
      supabasePublic.removeChannel(subscription);
    };
  });

  const sendMessage = (data: unknown) =>
    realtimeChannelRef.current?.send({
      type: 'broadcast',
      event: channelName,
      payload: data,
    });

  return { sendMessage, isConnecting };
}
