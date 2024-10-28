// Define the type for your stack's parameters
export type RootStackParamList = {
  Home: { actions: { [characterId: string]: string[] } }; // Home screen accepts actions per character
  Action: { character: { id: string; name: string } };      // Action screen requires a 'character' parameter
};