import React from "react";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as action from '../actions/languageAction'
import Main from '../components/main'
import firebase from 'react-native-firebase';
import {
  AsyncStorage,
} from 'react-native';

class MainContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      render:false,
      user:{
      }
    }
    AsyncStorage.getItem('user').then(user=>{
      this.setState({render:true});
      if (!user) {
        this.props.navigation.navigate('Login')
      }
      else {
        this.setState({
          user:JSON.parse(user)
        });
      }
    })
  }



  
  render(){
  return (
    this.state.render? <Main screenProps={{
        language:this.props.language,
        strings:this.props.strings,
        changeLanguage:this.props.changeLanguage,
        navigation:this.props.navigation, 
        firebase:firebase,
        user:this.state.user
    }} />
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


export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);