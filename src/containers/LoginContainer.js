import React from "react";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as action from '../actions/languageAction'
import LoginForm from '../components/loginForm'
import {
  AsyncStorage,
} from 'react-native';

class LoginContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      render:false
    }
    AsyncStorage.getItem('user').then(user=>{
      this.setState({render:true});
      if (user) {
        this.props.navigation.navigate('Main')
      };
    })
  }


  
  render(){
  return (
    this.state.render ? 
    <LoginForm 
    strings={this.props.strings} 
    navigation={this.props.navigation} 
    changeLanguage={this.props.changeLanguage}/>
  : null
  );
}}

const mapStateToProps = state => {
  return {
    strings: state.language.strings,
    language: state.language.language
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(action, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);