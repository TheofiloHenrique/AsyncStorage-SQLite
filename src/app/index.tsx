import {View,Button} from 'react-native'
import {useRouter} from 'expo-router'

export default function Home(){
  const router = useRouter()
  return (
    <View style ={{ flex: 1, justifyContent: 'center', gap: 12, padding: 20 }}>
      <Button title='SQLite Tasks' onPress={()=> router.push('/sqlite-tasks')}/>
      <Button title='AsyncStorage Tasks' onPress={()=> router.push('/storage-tasks')}/>
    </View>
  )
}