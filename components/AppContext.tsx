"use client";
import {State,Action, reducer, initState} from "@/reducers/AppReducer"
import {
  Dispatch,
  ReactNode,
  createContext,
  useMemo,
  useReducer,
} from "react";

//这里目前还有一个困惑点，在于isShow的类型，是boolean还是要引入reduce的State类型，不知道没有用会不会有影响
type AppContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

export const AppContext = createContext<AppContextType>(null!);

export default function AppContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer,initState);
  const showValue = useMemo(() => ({ state, dispatch}), [state, dispatch]);//这个是公共数据，关于navigation的
  return (
    <AppContext.Provider value={showValue}>
      {children}
    </AppContext.Provider>
  );
}
