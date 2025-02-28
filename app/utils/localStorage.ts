
// below functions are used to save and retrieve the game state from local storage
// this is used to maintain the game state even after the page is refreshed

export type localData = {
  secretKey: string;
  move: string;
};


export const saveGameState = (gameId: string, secretKey: string, move: string) => {
  localStorage.setItem(
    gameId,
    JSON.stringify({
      secretKey,
      move,
    })
  );
};

export const getGameState = (gameId: string)=> {
  const storedState = localStorage.getItem(gameId);
  if (!storedState) return null;

  const parsedState: localData = JSON.parse(storedState);

  return parsedState 
};




export const resetGameState = (gameId: string) => {
  localStorage.removeItem(gameId);
};