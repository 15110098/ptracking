import React from 'react';
import { Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Title, Button, Radio } from 'native-base';
import { View, Modal, StyleSheet, TouchableOpacity, AsyncStorage } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class SettingScreen extends React.Component {
    static navigationOptions = ({ screenProps: { strings } }) => ({
        title: strings.setting,
        header: null
    });

    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            language: this.props.screenProps.language,
        }
    }



    _toggleModal = () =>
        this.setState({ showModal: !this.state.showModal });

    changeLanguage = (lang) => {
        this.setState({
            language: lang,
        });
        this.props.screenProps.changeLanguage(lang);
    }

    onLogout = () => {
        let { firebase } = this.props.screenProps;
        let user = this.props.screenProps.user;
        let users = firebase.firestore().collection('users');

        AsyncStorage.removeItem('user', e => {
            if (e) ToastAndroid.show(e.message, ToastAndroid.LONG)
            else {
                users.get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            const { uid } = doc.data();
                            if (uid === user.uid) {
                                doc.ref.update({
                                    online: false
                                })
                                firebase.auth().signOut();
                            } 
                        })
                    })
                this.props.screenProps.navigation.navigate('Login');
            }
        })
    }

    render() {
        let { strings } = this.props.screenProps;
        return (
            <Container>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={this._toggleModal}>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity number={0} onPress={this._toggleModal} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.modal}>
                                <View style={styles.modal_content}>
                                    <Text>{strings.choose_language}:</Text>
                                    <List>
                                        <ListItem style={{ borderBottomWidth: 0, paddingBottom: 0 }}>
                                            <Radio selected={this.state.language === 'en-US'} style={{ paddingRight: 10 }}
                                                onPress={() => this.changeLanguage('en-US')} />
                                            <Text>{strings.english}</Text>
                                        </ListItem>
                                        <ListItem style={{ borderBottomWidth: 0, paddingBottom: 5 }}>
                                            <Radio selected={this.state.language === 'vi-VN'} style={{ paddingRight: 10 }}
                                                onPress={() => this.changeLanguage('vi-VN')} />
                                            <Text>{strings.vietnamese}</Text>
                                        </ListItem>
                                    </List>
                                </View>

                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Header>
                    <Body>
                        <Title>{strings.setting}</Title>
                    </Body>
                </Header>
                <Content>
                    <List>

                        <ListItem icon onPress={this._toggleModal}>
                            <Left>
                                <Ionicons name="ios-home" size={25} />
                            </Left>
                            <Body>
                                <Text>{strings.language}</Text>
                            </Body>
                            <Right>
                                <Text>{
                                    this.state.language === 'en-US' ? strings.english : strings.vietnamese
                                }</Text>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={this.onLogout}>
                            <Left>
                                <Ionicons name="md-log-out" size={25} />
                            </Left>
                            <Body>
                                <Text>{strings.logout}</Text>
                            </Body>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
        zIndex: 10
    },
    modal_content: {
        margin: 15,
        zIndex: 11
    }
});