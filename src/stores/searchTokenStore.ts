let activeSearchToken: string | null = null;

export const setSearchToken = (token: string | null) => {
  activeSearchToken = token;
};

export const getSearchToken = () => activeSearchToken;
