import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { EditorScreen } from './src/screens/EditorScreen';
import { PreviewScreen } from './src/screens/PreviewScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Editor"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Editor" component={EditorScreen} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
