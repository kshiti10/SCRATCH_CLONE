// Define the type for your stack's parameters
export type RootStackParamList = {
    Home: { actions?: string[] }; // Home screen may accept an optional 'actions' parameter
    Action: undefined;            // Action screen doesn't require any params
  };
  