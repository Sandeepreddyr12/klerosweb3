import { useState } from 'react';
import Image from 'next/image';

import styles from '../../page.module.css';
import KlerosLogo from '../../../public/media/klerosLogo.png'



type MoveType = 'Rock' | 'Paper' | 'Scissors' | 'Lizard' | 'Spock';
export type GameItemProps = {
    selectedCircle: string | null;
};

export function GameItem({ selectedCircle }: GameItemProps) {


     const moveRelations: Record<MoveType, { wins: string; losesTo: string }> =
            {
              Rock: {
                wins: 'scissors & lizard',
                losesTo: 'paper & spock',
              },
              Paper: {
                wins: 'rock & spock',
                losesTo: 'scissors & lizard',
              },
              Scissors: {
                wins: 'paper & lizard',
                losesTo: 'rock & spock',
              },
              Lizard: {
                wins: 'paper & spock',
                losesTo: 'rock & scissors',
              },
              Spock: {
                wins: 'rock & scissors',
                losesTo: 'paper & lizard',
              },
            };



    return (
      <div className={styles.item}>
        <div className={styles.itemImage}>
          {selectedCircle ? (
            selectedCircle.split(' ')[0]
          ) : (
            <Image src={KlerosLogo} alt="Kleros Logo" width={60} height={60} />
          )}
        </div>
        <div className={styles.itemDescription}>
          <div className={styles.itemTitle}>
            {selectedCircle ? (
              selectedCircle.split(' ')[1]
            ) : (
              <p style={{color : 'gold'}}>Kleros RPSLS</p>
            )}
          </div>
          <div className={styles.itemOutcomes}>
            {selectedCircle ? (
              <>
                <div className={styles.wins}>
                  <span>💚</span>
                  {
                    moveRelations[
                      (selectedCircle ?? '').split(' ')[1] as MoveType
                    ]?.wins
                  }
                </div>
                <div className={styles.loses}>
                  <span>🔻</span>
                  {
                    moveRelations[
                      (selectedCircle ?? '').split(' ')[1] as MoveType
                    ]?.losesTo
                  }
                </div>
              </>
            ) : (
              'Tap the icons to select your move'
            )}
          </div>
        </div>
      </div>
    );
}

export type InputFormProps = {
    address?: string;
    setAddress?: (value: string) => void;
    secretKey: string;
    setSecretKey: (value: string) => void;
    hideInput?: boolean;
};

export const InputForm = ({
  address,
  setAddress,
  secretKey,
  setSecretKey,
  hideInput
}:InputFormProps) => {


 const [showPassword, setShowPassword] = useState(false);


  return (
    <>
      {!hideInput && (
        <label>
          <input
        className={styles.input}
        type="text"
        placeholder=""
        required
        value={address}
        onChange={(e) => setAddress?.(e.target.value.toLowerCase())}
          />
          <span>Address</span>
        </label>
      )}
      <label>
        <div className={styles.passwordContainer}>
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            placeholder=""
            required
            value={secretKey}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '').replace(/[-+\.e]/g, '');
              setSecretKey(value);
            }}
          />
          <span>Secret key</span>
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </label>
    </>
  );
};





//its a custom number input component
//it takes amount and setAmount as props

export type NumberInputProps = {
    amount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
};

export function NumberInput({ amount,setAmount}: NumberInputProps) {
    
   const entryFee = 0.001;
  
  return (
      <div className={styles.customNumberInput}>
        <div className={styles.inputContainer}>
          <button
            onClick={() =>
              setAmount((prev) =>
                +(prev - 0.002).toFixed(3) > entryFee
                  ? +(prev - 0.002).toFixed(3)
                  : entryFee
              )
            }
            disabled={amount <= 0.001}
            data-action="decrement"
            className={styles.decrementButton}
          >
            <span className={styles.buttonText}>−</span>
          </button>
          <input
            type="number"
            className={styles.numberInput}
            name="custom-input-number"
            min={0.001}
            onChange={(e) =>
              setAmount(
                +parseFloat(e.target.value).toFixed(3) > entryFee
                  ? +parseFloat(e.target.value).toFixed(3)
                  : entryFee
              )
            }
            value={amount}
            // defaultValue={amount}
            // disabled={!HelperVar}
          />
          <button
            onClick={() => setAmount((prev) => +(prev + 0.002).toFixed(3))}
            data-action="increment"
            // disabled={!HelperVar}
            className={styles.incrementButton}
          >
            <span className={styles.buttonText}>+</span>
          </button>
          <div className={styles.currencySelectContainer}>
            {/*  */}
            <select
              id="currency"
              name="currency"
              className={styles.currencySelect}
            >
              <option className={styles.currencyOption}>Eth</option>
              <option disabled>Bitcoin</option>
              <option disabled>USD</option>
              <option disabled>INR</option>
            </select>
          </div>
        </div>
      </div>
    );
}







