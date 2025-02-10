"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

export type EventListener = (data?: unknown) => void;
//这里目前还有一个困惑点，在于isShow的类型，是boolean还是要引入reduce的State类型，不知道没有用会不会有影响
type EventBusContextProps = {
  subscribe: (event: string, callback: EventListener) => void;
  unsubscribe: (event: string, callback: EventListener) => void;
  publish: (event: string, data?: unknown) => void;
};

export const EventBusContext = createContext<EventBusContextProps>(null!);

export default function EventBusContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [listeners, setListeners] = useState<Record<string, EventListener[]>>(
    {}
  );

  const subscribe = useCallback(
    (event: string, callback: EventListener) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
      setListeners({ ...listeners });
    },
    [listeners]
  );

  const unsubscribe = useCallback(
    (event: string, callback: EventListener) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((cb) => cb !== callback);
        setListeners({ ...listeners });
      }
    },
    [listeners]
  );

  const publish = useCallback(
    (event: string, data?: unknown) => {
      if (listeners[event]) {
        listeners[event].forEach((callback) => callback(data));
      }
    },
    [listeners]
  );

  const contextValue = useMemo(
    () => ({ subscribe, unsubscribe, publish }),
    [subscribe, unsubscribe, publish]
  );
  return (
    <EventBusContext.Provider value={contextValue}>
      {children}
    </EventBusContext.Provider>
  );
}
