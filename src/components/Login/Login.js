import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { useCookies } from "react-cookie";
import styles from "./Login.module.css";

export default withRouter(function Login({ match, location, history }) {
  const [cookies, setCookie] = useCookies(["playerName"]);

  function onSubmit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    if (username.length > 4) {
      setCookie("playerName", username);
      history.push("/");
    }
  }

  return (
    <div className={styles.container}>
      <div>Login</div>
      <form onSubmit={onSubmit}>
        <input autoFocus name="username" type="text" placeholder="Username" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
});
