interface Variable {
  id: string;
  key: string;
  value: string;
}

const STORAGE_KEY = 'rest-client-variables';

export const getVariables = (): Variable[] => {
  // ls browser check
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse variables from Local Storage:', error);
    return [];
  }
};

export const substituteVariables = (
  input: string,
  variables: Variable[]
): string => {
  let output = input;
  const regex = /\{\{([^}]+)\}\}/g;

  output = output.replace(regex, (match, variableName) => {
    const found = variables.find((v) => v.key === variableName);
    return found ? found.value : match;
  });

  return output;
};
