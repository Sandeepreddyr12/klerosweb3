import { use, useEffect, useState } from 'react';
import styles from './myGames.module.css';
import formStyle from '../../page.module.css';

import { db } from '@/firebase';
import { ref, set, onValue } from 'firebase/database';
import { useAppContext, defaultContext } from '../../utils/context/context';
import {toast} from 'react-toastify';

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

  const [data, setData] = useState({});
  const AppState = useAppContext();

  console.log('from selcet btn', data);

  useEffect(() => {
    if (!AppState.owner) return;
    const starCountRef = ref(db, 'players/' + AppState.owner);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();

      console.log('bbbbbbbbbbb');

      setData(data);

      setSelectedOption(Object.keys(data)[0]);
    });
  }, [AppState.owner]);

  useEffect(() => {
    console.log('aaaaaaaa');

    console.log(AppState.owner, selectedOption);

    if (AppState.owner && selectedOption !== '') {
      if (selectedOption === 'new Game') {
        AppState.setCurrentGameId('');
        AppState.setGameData({ ...defaultContext.GameData });
      } else {
        AppState.setCurrentGameId(selectedOption);

        const starCountRef = ref(db, 'game/' + selectedOption);
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          console.log('dfaaa', data);

          AppState.setGameData(data);
        });
      }
    }
  }, [AppState.owner, selectedOption]);

  const keys = Object.keys(data);

  // useEffect(() => {
  //   setSelectedOption(keys[0]);
  // }, [])

  console.log('ddddddddddddddddddddddddddd', selectedOption, keys);

  const newGame = () => {
    console.log('new game');
    toast.info('You have started a new game, Id is created after start');
    setSelectedOption('new Game');
  };

  return (
    <div>
      {data !== undefined &&
        data !== null &&
        keys.filter((key) => key !== 'isEmpty').length !== 0 && (
          <div
            className={formStyle.form}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '2rem',
              zIndex: '100',
              width: '15rem',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <div className={styles.listChoice} style={{ width: '80%' }}>
              <div
                className={styles.listChoiceTitle}
                onClick={handleDropdownClick}
              >
                {selectedOption !== '' ? selectedOption : 'Time for new game'}
              </div>
              <div className={styles.listChoiceObjects} onBlur={handleFocusOut}>
                {keys
                  .filter((key) => key !== 'isEmpty')
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
                        <span>{key}</span>
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
    </div>
  );
};

export default GameInput;
