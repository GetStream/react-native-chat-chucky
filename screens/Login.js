import React, { Component } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Link } from "react-router-native";

const hitSlop = { top: 24, right: 24, bottom: 24, left: 24 };

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name: ""
    };
  }

  _handleChange = name => value => {
    this.setState({
      [name]: value
    });
  };

  _renderLink = props => (
    <TouchableOpacity disabled={!this._canLogin} hitSlop={hitSlop} {...props} />
  );

  render() {
    const { email, name } = this.state;
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.brand}>
          <Image style={styles.logo} source={require("../images/chuck.png")} />
          <Text style={styles.name}>Chuck Bot</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={this._handleChange("name")}
          value={name}
        />
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          placeholder="Email"
          onChangeText={this._handleChange("email")}
          value={email}
        />
        <View style={styles.btnWrapper}>
          <Link to={this._to} component={this._renderLink}>
            <Text style={this._labelStyle}>Chat with Chuck</Text>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  get _to() {
    return {
      pathname: "/chat",
      state: {
        user: this.state
      }
    };
  }

  get _canLogin() {
    const { email, name } = this.state;
    return Boolean(name) && Boolean(email);
  }

  get _labelStyle() {
    return {
      ...styles.btnLabel,
      color: this._canLogin ? "rgb(0, 122, 255)" : "#eeeeee"
    };
  }
}

export default Login;

const styles = StyleSheet.create({
  btnLabel: {
    fontSize: 16,
    color: "rgb(0, 122, 255)"
  },
  btnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32
  },
  brand: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32
  },
  input: {
    flexDirection: "row",
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 8,
    borderRadius: 8,
    borderColor: "#f9f9f9",
    borderWidth: 2,
    padding: 16,
    width: 343
  },
  logo: {
    width: 80,
    height: 112
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 16
  },
  root: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center"
  }
});
