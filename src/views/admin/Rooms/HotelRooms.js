import React, { useState } from 'react';
import {
  StyleSheet, View, FlatList, Text, Image, Button,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';

const hotelImage = require('../../../../assets/hotel_avatar.png');

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Playfair',
    paddingBottom: 10,
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Playfair',
  },
});

const Rooms = ({ route, navigation }) => {
  const user = (route && route.params && route.params.user) ? route.params.user : { email: '', password: '' };
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  function getRooms() {
    const options = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
      params: {
        hotel_id: user.hotel_admin,
      },
    };

    axios.get('https://hotelhubip.herokuapp.com/users/actions/rooms', options)
      .then((response) => {
        console.log(response.data);
        setRooms(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteRoom(room) {
    console.log(room);
    const options = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
      params: {
        room_id: room.room_id,
      },
    };

    axios.get('https://hotelhubip.herokuapp.com/admin/actions/room/delete', options)
      .then((response) => {
        console.log(response.data);
        getRooms();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (rooms.length === 0) {
    getRooms();
  }

  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <View>
      <Button title="Toggle drawer" onPress={() => navigation.toggleDrawer()} />
      <Button title="Add room" />

      <Searchbar
        placeholder="Search a location"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.room_id}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Image source={hotelImage} style={styles.image} />
            <Text style={styles.text}>
              Room
              {' '}
              {item.name}
              {' \n'}
              Price:
              {' '}
              {item.price}
            </Text>
            <Button title="Delete room" onPress={() => deleteRoom(item)} />
          </View>
        )}
      />
    </View>
  );
};

export default Rooms;
