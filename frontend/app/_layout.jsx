import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Speech Spark' }} />
      <Stack.Screen name="practiceScreen" options={{ title: 'Practice Session' }} />
      <Stack.Screen name='agentSelect' options={{title: 'Select Agent'}}/>
    </Stack>
  );
}