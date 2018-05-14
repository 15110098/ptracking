import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import { StyleSheet, View, TextInput, ToastAndroid, Keyboard, ActivityIndicator,AsyncStorage, Picker } from 'react-native';
import firebase from 'react-native-firebase';
import SplashLoading from './splashLoading'
import SmsListener from 'react-native-android-sms-listener' 
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.users = firebase.firestore().collection('users');
        this.subscription = SmsListener.addListener(message => {
            let verificationCodeRegex = /Your Firebase App verification code is ([\d]{6})/;
            if (verificationCodeRegex.test(message.body)) {
                let code = message.body.match(verificationCodeRegex)[1]
                console.log(message.body.match(verificationCodeRegex))
                if (code) {
                    this.setState({code},this.confirmCode);
                }
            }
            
        })
        this.state = {
            phone: '',
            country: '+84',
            step: '1',
            loading: false,
            confirmer: null,
            user: null,
            code:''
        }
    }


    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user.toJSON() });
            } else {
                this.setState({
                    phone: '',
                    country: '+84',
                    step: '1',
                    loading: false,
                    confirmer: null,
                    user: null
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
     }


    toggleOnline(user){
        this.users.get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc=>{
                const { uid } = doc.data();
                let updated=false;
                 if (uid===user.uid){
                     doc.ref.update({
                        online:true
                    }) 
                } 
                if (!updated) this.users.add(Object.assign({},user,{online:true}));            
                
            })
        })
        this.subscription.remove()
    }

    sendVerifyCode = () => {
        this.setState({
            loading: true
        })
        Keyboard.dismiss();
        let {phone} = this.state;
        let phone_number = ''
        if (phone.charAt(0)==='0') phone_number=phone.replace('0','+84')
        
        firebase.auth().signInWithPhoneNumber(phone_number)
            .then(res => {
                this.setState({
                    loading: false
                })
                if (res) this.setState({
                    step: '2',
                    confirmer: res
                })
            })
            .catch(e => {
                this.setState({
                    loading: false
                })
                ToastAndroid.show(e.message, ToastAndroid.LONG);
            });
    }

    confirmCode = () => {
        this.setState({
            loading: true
        })
        const { code, confirmer } = this.state;
    
        if (confirmer && code.length) {
            confirmer.confirm(code)
            .then((user) => {
                AsyncStorage.setItem('user', JSON.stringify(user),e=>{
                    if (e) ToastAndroid.show(e.message, ToastAndroid.LONG)
                })
                this.setState({
                    loading: false
                })
              if (user) {
                  this.toggleOnline(user._user);
                  this.props.navigation.navigate('Main')
                };
            })
            .catch(e => {
                this.setState({
                    code:'',
                    loading:false
                });
                ToastAndroid.show(e.message, ToastAndroid.LONG)}
            );
        }
      };

    renderPhoneInput = (strings) => (
        <View>
        <Text style={{textAlign:'center', color:'white', fontSize:25}}>{strings.phone_input}</Text>
        <Text style={{textAlign:'center', color:'white', marginBottom:15, marginTop:5}}>{strings.phone_sub}</Text>
        <Form>
            <Item regular style={styles.item}>
                <Input regular 
                style={{ backgroundColor: 'white', textAlign:'center', fontSize:25, height:50 }} 
                keyboardType='numeric'
                value={this.state.phone}
                onChangeText={(phone) => this.setState({ phone })} 
                disabled={this.state.loading}/>
            </Item>
            <Button full dark style={styles.button} onPress={this.sendVerifyCode} disabled={this.state.loading||this.state.phone.length<10}>
           
        <Text>
            {strings.continue}
        </Text>
            </Button>
        </Form>
        </View>
    )

    renderCodeInput = (strings) => (
        <View>
        <Text style={{textAlign:'center', color:'white', fontSize:25}}>{strings.otp_input}</Text>
        <Text style={{textAlign:'center', color:'white', marginBottom:15, marginTop:5}}>{strings.otp_sub} {this.state.phone}</Text>
        <Form>
            <Item regular style={styles.item}>

                <Input regular autoFocus style={{ backgroundColor: 'white', textAlign:'center', fontSize:25, height:50 }} 
                 keyboardType='numeric' 
                 value={this.state.code}
                    onChangeText={(code) => this.setState({ code })} 
                    disabled={this.state.loading} />
            </Item>
            <Button full dark style={styles.button} onPress={this.confirmCode} disabled={this.state.loading}>
            <Text>
                    {strings.login}
                </Text>
            </Button>
        </Form>
        <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
        <Text style={{textAlign:'center', color:'white'}}>{strings.otp_receive}</Text>
        <Button transparent light style={{padding:0}} onPress={()=>this.setState({
            phone: '',
            step: '1',
            confirmer:null,
            code:''
        })}><Text>{strings.retry}</Text></Button>
        </View>

        </View>
    )

    render() {
        let { strings, navigation, changeLanguage } = this.props;
        let { step } = this.state;
        return (
            <Container style={styles.container}>
                {this.state.loading && <SplashLoading/>}
                
                <Content>
                    {
                        (step === '1') && this.renderPhoneInput(strings)}
                    {(step === '2') && this.renderCodeInput(strings)
                    }
                    <View style={styles.button_container}>
                        <Button transparent light style={styles.button_language} onPress={() => changeLanguage('en-US')}>
                            <Text>
                                {strings.english}
                            </Text>
                        </Button>
                        <Button transparent light style={styles.button_language} onPress={() => changeLanguage('vi-VN')}>
                            <Text>
                                {strings.vietnamese}
                            </Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2E7D32',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight:15,
        paddingLeft:15
    },
    input: {
        backgroundColor: 'white',
    },
    item: {
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        padding: 5,
    },
    button: {
        margin: 5, height:50
    },
    button_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'

    },
    button_language: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});




export default LoginForm;