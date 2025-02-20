'use client';

import { useState } from 'react';

export const useLastChanged = <T,>(value1: T, value2: T): T => {
    const [lastChanged, setLastChanged] = useState<T>(value1);
    const [previousValues, setPreviousValues] = useState({ value1, value2 });

 
        if (value1 !== previousValues.value1) {
            setLastChanged(value1);
        } else if (value2 !== previousValues.value2) {
            setLastChanged(value2);
        }
        
        setPreviousValues({ value1, value2 });
   

    return lastChanged;
};