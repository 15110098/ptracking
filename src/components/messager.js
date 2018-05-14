import React from 'react';
import { Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, Title } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat'

export default class MessagerScreen extends React.Component {
    static navigationOptions = ({ screenProps: { strings } }) => ({
        title: strings.messager,
        header: null
    });

    constructor(props){
        super(props);
        let {firebase} = this.props.screenProps;
        this.messages = firebase.firestore().collection('messages');
        //this.rooms = firebase.firestore().collection('rooms');
        this.user = this.props.screenProps.user;
        this.unsubscribe = null;
        this.state = {
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date().getTime(),
                    user: {
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                },
            ],
        }
    }

    componentDidMount() {
        
    }
    
   

    onSend(messages = []) {
        let message = messages[0];
        this.messages.add(Object.assign({},message,{
            user:{
                _id:this.user.uid,
                name:this.user.phoneNumber
            }
        }))
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    render() {
        let { strings } = this.props.screenProps;

        return (
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: 1,
                        }}
                    />
        );
    }
}