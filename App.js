import React, { Component } from "react";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { NativeRouter as Router, Route, Switch } from "react-router-native";

import Chat from "./screens/Chat";
import Login from "./screens/Login";

export default class App extends Component {
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled style={styles.root}>
        <Router>
          <Switch>
            <Route exact path="/chat" component={Chat} />
            <Route path="/" component={Login} />
          </Switch>
        </Router>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white"
  }
});
