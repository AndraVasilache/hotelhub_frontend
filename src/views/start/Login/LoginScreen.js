import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, Platform,
} from 'react-native';
import { TextInput, HelperText, Avatar } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

const defaultAvatar = require('../../../../assets/usericon.png');

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  input: {
    width: 300,
    height: 44,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    fontFamily: 'Playfair',
  },
  inputText: {
    color: 'white',
    fontFamily: 'Playfair',
    fontSize: Platform.OS === 'web' ? 20 : 15,
  },
  button: {
    backgroundColor: '#5c0099',
    borderRadius: 25,
    height: 50,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    fontSize: 30,
  },
  pictureStyle: {
    backgroundColor: 'white',
    borderRadius: 0,
    borderColor: 'transparent',
  },
});

const SignUpScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [incorrectLogin, setIncorrectLogin] = useState(false);

  const emailValidation = () => !user.email.includes('@');

  function login() {
    const options = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
      params: user,
    };

    axios.get('https://hotelhubip.herokuapp.com/users/login', options)
      .then((response) => {
        if (response.data === '') {
          setIncorrectLogin(true);
          return;
        }

        const loginUser = response.data;

        console.log(loginUser);
        if (loginUser.admin === true) {
          console.log(loginUser.hotel_admin !== 0);
          if (loginUser.hotel_admin && loginUser.hotel_admin !== '') { // TODO: schimba cu string
            navigation.navigate('AdminHome', { user: loginUser });
          } else {
            navigation.navigate('HotelRegistration', { user: loginUser });
          }
        } else {
          navigation.navigate('UserHome', { user: loginUser });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={40}
    >
      <View style={styles.containerView}>
        <Avatar.Image size={100} source={defaultAvatar} style={styles.pictureStyle} />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={user.email}
          onChangeText={(email) => setUser({ ...user, email })}
        />
        {user.email && emailValidation() ? (
          <HelperText type="error" visible={emailValidation()}>
            Email address is invalid!
          </HelperText>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={user.password}
          onChangeText={(password) => setUser({ ...user, password })}
        />

        <HelperText type="error" visible={incorrectLogin}>
          Incorrect email or password!
        </HelperText>

        <TouchableOpacity
          style={styles.button}
          onPress={() => login()}
        >
          <Text style={styles.inputText}>
            Log in
          </Text>
        </TouchableOpacity>

      </View>

    </KeyboardAwareScrollView>
  );
};

export default SignUpScreen;
