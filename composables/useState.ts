// Create a composable for shared state
export const useSharedState = () => useState('shared', () => ({
  homeId: '',
  address1: '',
  // other shared data
})) 