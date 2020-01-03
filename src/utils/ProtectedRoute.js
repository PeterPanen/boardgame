import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

export default props => {
  const [cookies] = useCookies(["playerName"]);
  const { children: ChildComponent, ...restProps } = props;

  return <Route {...restProps} children={cookies?.playerName ? ChildComponent : <Redirect to="/login" />} />;
};
