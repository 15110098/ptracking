import React from 'react'
import { StyleSheet, View, ActivityIndicator, Dimensions,Text } from 'react-native';

const SplashLoading = () => (
    <View style={styles.overlay}>
    <View style={styles.container}>
        <ActivityIndicator size="large" color="white" style={{zIndex:1002}}/>
        </View>
    </View>
)
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    overlay: {
        zIndex:1000,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    },
    container: {
        zIndex:1001,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

});

export default SplashLoading