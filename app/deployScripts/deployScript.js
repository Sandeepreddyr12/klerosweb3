'use client';

import { ethers } from 'ethers';
import  HasherArtifact from '../../Contract/build/Hasher.json';
import RPSArtifact from '../../Contract/build/RPS.json';
import {toast} from 'react-toastify';

export async function deployHasher(
    
) {
  // Connect to MetaMask
  const provider = new ethers.BrowserProvider(window.ethereum);
  // Request account access
  await provider.send('eth_requestAccounts', []);
  // Get the signer
  const signer = await provider.getSigner();
;

  try {
    // Get the contract factory
    const hasherFactory = new ethers.ContractFactory(
      HasherArtifact.abi,
      HasherArtifact.bytecode,
      signer
    );

    // Deploy the contract
    console.log('Deploying Hasher contract...');
    const hasherContract = await hasherFactory.deploy();
    console.log('Hasher contract deployed to:', hasherContract.address);

    
      await hasherContract.waitForDeployment(); 

    console.log('hasher contract deployed')

    return hasherContract;
  } catch (error) {
    toast.error('Error deploying Hasher contract, retry again');

  }
}

export async function deployRPS(moveHash, player2Address, amount) {

  console.log('callllled', moveHash, player2Address, amount,window.ethereum) ;
  // Connect to MetaMask
  const provider = new ethers.BrowserProvider(window.ethereum);
  console.log('provider reached')
  // Request account access
  await provider.send('eth_requestAccounts', []);
  console.log('account access granted')
  // Get the signer
  const signer = await provider.getSigner();
  console.log('signer reached')


  try {
    // Get the contract factory
    const RPSFactory = new ethers.ContractFactory(
      RPSArtifact.abi,
      RPSArtifact.bytecode,
      signer
    );

    // Deploy the contract
    console.log('Deploying RPS contract...');
    const RPSContract = await RPSFactory.deploy(moveHash, player2Address, {
      value: ethers.parseEther(amount.toString()),
    });
    
    
    const deployedContract = await RPSContract.waitForDeployment(); 

    const address = await deployedContract.getAddress();
    console.log('RPS contract deployed to:', await deployedContract.getAddress());
    console.log('RPS contract deployed');


    return address;
  } catch (error) {
    toast.error('Error deploying Hasher contract, retry again');
  }
}