
export type localData = {
  secretKey: string;
  move: string;
  timer: number;
};


export const saveGameState = (gameId: string, secretKey: string, move: string) => {
  const timer = Date.now() + 5 * 60 * 1000;
  localStorage.setItem(
    gameId,
    JSON.stringify({
      secretKey,
      move,
      timer
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