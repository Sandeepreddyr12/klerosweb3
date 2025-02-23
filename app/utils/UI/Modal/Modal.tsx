import styles from './modal.module.css';
import { useState } from 'react';
import { useAppContext, type gameStateType } from '../../context/context';

export default function Modal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   const { info, setInfo } = useState('');
  const Data = useAppContext();

  function status(gameState: gameStateType) {
    switch (gameState) {
      case 'yetToStart':
        return 'Waiting for rival to join...';
      case 'started':
        return 'Game started!';
      case 'p2Joined':
        return 'Rival has joined!';
      case 'finished':
        return 'Game finished!';
      case 'recovered':
        return 'Funds recovered!';
      default:
        return 'Waiting for rival to join...';
    }
  }

  function getResult() {
    const styles: React.CSSProperties = {};
    let text = '--';
    if (Data.GameData.gameState === 'finished') {
      if (Data.GameData.won_Recovered_By === 'MatchDrawn') {
        styles.color = 'blue';
        text = 'Match Drawn';
      } else {
        styles.color =
          Data.GameData.won_Recovered_By === Data.owner
            ? 'darkGreen'
            : 'maroon';
        text =
          Data.GameData.won_Recovered_By === Data.owner
            ? 'You Won!'
            : 'You Lost!';
      }
    } else if (Data.GameData.gameState === 'recovered') {
      styles.color =
        Data.GameData.won_Recovered_By === Data.owner ? 'blue' : 'maroon';
      text =
        Data.GameData.won_Recovered_By === Data.owner
          ? 'Recovered by You'
          : 'Recovered by Opponent';
    }
    return <span style={styles}>{text}</span>;
  }

  function getMove() {
    if (
      Data.GameData.gameState === 'finished' &&
      Data.GameData.moves[0] !== ''
    ) {
      return Data.owner === Data.GameData.player1
        ? Data.GameData.moves[0]
        : Data.GameData.moves[1];
    }
    return '';
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.openBtn}
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        Open Modal
      </button>

      {isModalOpen && (
        <>
          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          />
          <div className={styles.modal_container}>
            <div className={styles.modal}>
              <div className={styles.modal__details}>
                <h1 className={styles.modal__title}>
                  Match : {Data.currentGameId}
                </h1>
                <div className={styles.game__description}>
                  <div>
                    You :- {Data.owner}{' '}
                    <span style={{ color: 'gold' }}>{getMove()}</span>{' '}
                  </div>
                  <div>
                    Opp :- {''}
                    {Data.owner === Data.GameData.player1
                      ? Data.GameData.player2
                      : Data.GameData.player1}{' '}
                    <span style={{ color: 'gold' }}>{getMove()}</span>
                  </div>
                  <div>Contract :- {Data.GameData.RPSaddress}</div>
                  <div>Status : {status(Data.GameData.gameState)}</div>
                  <div> Stake: {Data.GameData.stake} </div>

                  <div>result : {getResult()}</div>
                </div>
              </div>

              <div className={styles.gameStatus}>
                {Data?.GameData && Data.GameData.won_Recovered_By && (
                  <>
                    {Date.now() >
                    Number(Data.GameData.timer) + 5 * 60 * 1000 ? (
                      <>
                        {Data.owner === Data.GameData.player1 ? (
                         ( Data.GameData.gameState === 'p2Joined') ? (
                            <div style={{ color: 'orange' }}>
                              The other player has joined, and the 5-minute
                              timeout has elapsed. You must now solve the game,
                              otherwise they can claim the entire stake.
                            </div>
                          ) : Data.GameData.gameState === 'started' ? (
                            <div>
                              The other player has not joined, and the 5-minute
                              timeout has elapsed. You may now recover your
                              funds or wait for their response.
                            </div>
                          ) : null
                        ) : Data.owner === Data.GameData.player2 &&
                          Data.GameData.gameState === 'p2Joined' ? (
                          <div>
                            The other player has not solved/proceeded further,
                            and the 5-minute timeout has elapsed. You may now
                            recover your funds or wait further.
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </>
                )}
              </div>

              {/* <button className= {styles.modal__btn}>Button →</button> */}

              <button
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
