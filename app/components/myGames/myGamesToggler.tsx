'use client';

import {  useEffect, useState } from 'react';
import { db } from '@/firebase';
import { ref, onValue } from 'firebase/database';
import {toast} from 'react-toastify';

import styles from './myGames.module.css';
import formStyle from '../../page.module.css';
import { useAppContext, defaultContext } from '../../utils/context/context';



//This component lets the user select a game from the list of games they have played before.

type playersData = {
  [key: string]: {
    status: string;
    createdAt: number;
  }
}

const GameInput = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option: string) => {
    setShowDropdown(false);
    setSelectedOption(option);
    toast.info(`You've selected the game ${option}`);
  };

  const handleFocusOut = () => {
    setShowDropdown(false);
  };

  const [data, setData] = useState<playersData>({});
  const AppState = useAppContext();


  useEffect(() => {
    if (!AppState.owner) return;
    const starCountRef = ref(
      db,
      process.env.NEXT_PUBLIC_PLAYERS_PATH + AppState.owner
    );
    onValue(
      starCountRef,
      (snapshot) => {
        const data = Object.entries(snapshot.val() as playersData || {})
          .filter(([key]) => key !== 'isEmpty')
          .sort(([,a], [,b]) => b.createdAt - a.createdAt)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});


        setData(data);

        setSelectedOption(
          data === null ||
            data === undefined ||
            Object.keys(data).length === 0 
            ? 'New Game'
            : Object.keys(data)[0]
        );
      }
    );
  }, [AppState.owner]);

  useEffect(() => {

    if (AppState.owner && selectedOption !== '') {
      if (selectedOption === 'New Game') {
        AppState.setCurrentGameId('');
        AppState.setGameData({ ...defaultContext.GameData });
      } else {
        AppState.setCurrentGameId(selectedOption);

        const starCountRef = ref(
          db,
          process.env.NEXT_PUBLIC_GAMES_PATH + selectedOption
        );
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();

          AppState.setGameData(data);
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AppState.owner, selectedOption]);


  const newGame = () => {
    toast.info('You have started a new game, Id is created after start');
    setSelectedOption('New Game');
  };

  return (
    <>
      {data !== undefined &&
        data !== null &&
        (
          <div
            className={formStyle.form}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '3vmin',
              zIndex: '100',
              width: '35vmin',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <div className={styles.listChoice} style={{ width: '80%' }}>
              <div
                className={styles.listChoiceTitle}
                onClick={handleDropdownClick}
              >
                {selectedOption !== '' ? selectedOption : 'New Game'}
              </div>
              <div className={styles.listChoiceObjects} onBlur={handleFocusOut}>
                {Object.keys(data)
                  .map((key) => {
                    return (
                      <label key={key}>
                        <input
                          type="radio"
                          name={key}
                          onClick={() => handleOptionClick(key)}
                          checked={selectedOption === key}
                          readOnly
                        />{' '}
                        <span
                          style={{
                            borderRight:
                              data[key].status === 'finished' ||
                              data[key].status === 'recovered'
                                ? '1px solid red'
                                : 'none',
                          }}
                        >
                          {key}
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>

            <button
              className={formStyle.submit}
              // disabled={btnStatus()}
              onClick={newGame}
              style={{ width: '25%' }}
            >
              ➕<span className={formStyle.tooltip}>New Game</span>
            </button>
          </div>
        )}
    </>
  );
};

export default GameInput;
