// import { getDatabase, ref, onValue, get } from 'firebase/database';



/**
 * Note: This component is not working as intended
 * 
 * This component was supposed to be a way to create online accounts, kinda like websockets room
 * I invested two days, and it didn't work out, I'll put it in my feature todo's for now
 * The idea was to have a presence system, where users are added to a room when they enter the app
 * and removed when they leave the app. This way, the app can be notified when a user is online
 * or offline. The problem is that this requires authentication, which I don't have setup yet
 * So, this component is not working yet, but it's a good idea to have for the future
 */


export default function onlineStatus() {
  // Function to establish player presence
  // function establishPresence(userId) {
  //   const presenceRef = ref(db, `process.env.NEXT_PUBLIC_PLAYERS_PATH${userId}/presence`); //Note change from users to players
  //   const connectedRef = ref(db, '.info/connected');
  //   onValue(connectedRef, (snapshot) => {
  //     if (snapshot.val() === true) {
  //       set(presenceRef, {
  //         online: true,
  //         lastChanged: serverTimestamp(),
  //       }).catch((error) => {
  //         console.error('Error setting online presence:', error);
  //       });
  //       onDisconnect(presenceRef)
  //         .set({ online: false, lastChanged: serverTimestamp() })
  //         .catch((error) => {
  //           console.error(
  //             'Error setting offline presence on disconnect:',
  //             error
  //           );
  //         });
  //     }
  //   });
  // }
  // // Function to check player online status
  // async function checkPlayerOnlineStatus(playerIds: string[]) {
  //   const onlinePlayers: { [key: string]: boolean | null } = {};
  //   const promises = playerIds.map(async (playerId) => {
  //     try {
  //       const presenceRef = ref(db, `process.env.NEXT_PUBLIC_PLAYERS_PATH${playerId}/presence`); //Note change from users to players
  //       console.log(
  //         `Checking presence for ${playerId} at path: ${presenceRef.path}`
  //       );
  //       const snapshot = await get(presenceRef);
  //       console.log(`Snapshot for ${playerId}:`, snapshot.exists());
  //       onlinePlayers[playerId] = snapshot.exists()
  //         ? snapshot.val().online
  //         : null; //Handle potential missing data
  //     } catch (error) {
  //       console.error(`Error checking online status for ${playerId}:`, error);
  //       onlinePlayers[playerId] = null;
  //     }
  //   });
  //   await Promise.all(promises);
  //   return onlinePlayers;
  // }
  // const playerIds = Object.keys(players);
  // useEffect(() => {
  //   (async () => {
  //     await Promise.all(
  //       playerIds.map((playerId) => establishPresence(playerId))
  //     );
  //     const onlineStatus = await checkPlayerOnlineStatus(playerIds);
  //     console.log('Online Players:', onlineStatus);
  //   })();
  // }, [])
}
