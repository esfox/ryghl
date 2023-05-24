import { SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_ANON_KEY } from '@/constants';

import { RealtimeChannel, createClient } from '@supabase/supabase-js';
import { useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';

export type UseRealtimeParams = {
  channelName: string;
  onMessage: (message: ScrollRealtimeEventType) => void;
};

type ScrollRealtimeEventType = {
  scrollPercent: number;
};

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_ANON_KEY);

export function useRealtime({ channelName, onMessage }: UseRealtimeParams) {
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffectOnce(() => {
    const subscription = supabase
      .channel(channelName, {
        config: {
          broadcast: {
            ack: true,
          },
        },
      })
      .on('broadcast', { event: channelName }, (data) => {
        const eventData = data.payload as ScrollRealtimeEventType;
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
      supabase.removeChannel(subscription);
    };
  });

  const sendMessage = (data: ScrollRealtimeEventType) =>
    realtimeChannelRef.current?.send({
      type: 'broadcast',
      event: channelName,
      payload: data,
    });

  return { sendMessage, isConnecting };
}
