

export default function onlineStatus() {
  // Function to establish player presence
  // function establishPresence(userId) {
  //   const presenceRef = ref(db, `players/${userId}/presence`); //Note change from users to players
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
  //       const presenceRef = ref(db, `players/${playerId}/presence`); //Note change from users to players
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