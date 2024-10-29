export type RootStackParamList = {
  Home: {
    characterActions?: { [key: number]: string[] };
  };
  Action: {
    characterId: number;
    setCharacterActions: (actions: { [key: number]: string[] }) => void;
  };
};
