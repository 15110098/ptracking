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
        this.user = this.props.screenProps.user;
        this.unsubscribe = null;
        this.state = {
            messages: [            
            ],
        }
    }

    componentDidMount() {
        this.unsubscribe = this.messages.onSnapshot(this.onCollectionUpdate)
    }

    onCollectionUpdate = (querySnapshot) => {
        console.log('update')
        let messages = [];
        querySnapshot.forEach(doc=>{
            const data=doc.data();
            if (data.to=="+84935235788") {
                messages.push(Object.assign({},data,{
                    user:{
                        _id:data.from.name
                    }
                }));
            } else if (data.from.name=="+84935235788") {
                messages.push(Object.assign({},data,{
                    user:{
                        _id:data.from.name
                    }
                }));
        }})
        messages.sort((a,b)=> b.createdAt-a.createdAt)
        this.setState({messages});
    }

    
    
    componentWillUnmount() {
        this.unsubscribe();
    }

    getMessage = () => {
        let {phoneNumber} = this.user;
        this.messages.where('to','==',phoneNumber).get().then(_querySnapshot=>{
            this.messages.where('from.name','==',phoneNumber).get().then(__querySnapshot => {
                let docs = _querySnapshot.docs.concat(__querySnapshot.docs);
                let messages = [];
                docs.forEach(doc=>{
                    const data = doc.data();
                    messages.push(Object.assign({},data,{
                        user:{
                            _id:data.from.name
                        }
                    }));
                })
                messages.sort((a,b) => b.createdAt-a.createdAt)
                this.setState({messages});
            })
           
        })
    }


    onSend(messages = []) {
        let message = messages[0];
        this.messages.add(Object.assign({},message,{
            from:{
                _id:this.user.phoneNumber,
                name:this.user.phoneNumber
            },
            to:'admin',
            createdAt: new Date().getTime()
        }))
      
    }

    render() {
        let { strings } = this.props.screenProps;

        return (
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: this.user.phoneNumber,
                        }}
                    />
        );
    }
}