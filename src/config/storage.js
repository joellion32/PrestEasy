import AsyncStorage from '@react-native-async-storage/async-storage';

// save data into storage
export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(`@${key}`, value)
    } catch (e) {
        return e;
    }
}

// get data user storage
export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(`@${key}`)
      if(value !== null) {
        return value
      }
    } catch(e) {
      return e;
    }
  }


// delete data into storage
export const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(`@${key}`)
    } catch(e) {
      return e
    }
  }

