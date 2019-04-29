import React, { Component } from "react";
import { Constants, LinearGradient } from "expo";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  SystemMessage
} from "react-native-gifted-chat";
import { StreamChat } from "stream-chat";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import axios from "axios";
import md5 from "md5";

const client = new StreamChat("<YOUR_STREAM_APP_ID");

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      typingText: null,
      user: null,
      token: null,
      channel: null
    };

    this._isMounted = false;
    this._isAlright = null;
  }

  componentWillMount() {
    this._isMounted = true;

    this.setState({
      messages: require("../data/messages.js")
    });
  }

  async componentDidMount() {
    const { location } = this.props;
    const user = location.state.user;

    try {
      const init = await axios.post("<YOUR_SERVERLESS_INVOCATION_URL>", {
        name: user.name,
        email: user.email
      });

      await client.setUser(init.data.user, init.data.token);

      const channel = client.channel("messaging", md5(user.email), {
        name: "Chat with Chuck Norris",
        members: ["chuck", init.data.user.id]
      });

      await channel.create();
      await channel.watch();

      channel.on(event => this.incoming(event));

      this.setState({
        user: init.data.user,
        token: init.data.token,
        channel
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  incoming(evt) {
    if (evt.type === "message.new" && evt.user.id !== this.state.user.id) {
      this.onReceive(evt);
    }
  }

  onSend = async (messages = []) => {
    try {
      await this.state.channel.sendMessage({
        text: messages[0].text
      });

      this.setState(previousState => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
          typingText: "Chuck Norris is typing..." // mock typing indicator
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  onReceive = data => {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: data.message.id,
          text: data.message.text,
          createdAt: data.message.created_at,
          user: {
            _id: data.message.user.id,
            name: data.message.user.name
          }
        }),
        typingText: null
      };
    });
  };

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#f0f0f0"
          }
        }}
      />
    );
  };

  renderInputToolbar = props => {
    if (isIphoneX()) {
      return (
        <SafeAreaView>
          <InputToolbar {...props} />
        </SafeAreaView>
      );
    }
    return <InputToolbar {...props} />;
  };

  renderSystemMessage = props => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15
        }}
        textStyle={{
          fontSize: 14
        }}
      />
    );
  };

  renderFooter = props => {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      );
    }

    return null;
  };

  render() {
    if (!this.state.user) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      );
    }

    const { user } = this.state;

    return (
      <>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: user.id // sent messages should have same user._id
          }}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          renderInputToolbar={this.renderInputToolbar}
          renderFooter={this.renderFooter}
          listViewProps={this._listViewProps}
        />
        <LinearGradient
          pointerEvents="none"
          colors={this._gradient}
          style={styles.header}
        />
      </>
    );
  }

  get _gradient() {
    return [
      "rgba(255, 255, 255, 1)",
      "rgba(255, 255, 255, 1)",
      "rgba(255, 255, 255, 0)"
    ];
  }

  get _listViewProps() {
    return {
      style: styles.listViewStyle,
      contentContainerStyle: styles.contentContainerStyle
    };
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  footerText: {
    fontSize: 14,
    color: "#aaa"
  },
  header: {
    height: Constants.statusBarHeight + 64,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  listViewStyle: {
    flex: 1,
    marginBottom: isIphoneX() ? getBottomSpace() : 0
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  contentContainerStyle: {
    paddingTop: 24
  }
});
