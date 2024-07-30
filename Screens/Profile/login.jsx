import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { client } from '../KindeConfig';
import services from './../services';
import Home from '../Index';

export default function Login() {
  const router = useRouter();

  const handleSignIn = async () => {
    const token = await client.login();
    if (token) {
      await services.storeData('login', 'true');
      router.replace('/');
    }
  };

  return (
    <View style={styles.imageContainer}>
      <View>
        <Text>Welcome to Personal Tracker App</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={{ color: 'white' }}>Log In or Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: 'purple',
    padding: 20,
    marginTop: 20,
  },
});
