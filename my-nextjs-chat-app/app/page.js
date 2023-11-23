"use client"

import React, { useEffect, useState } from 'react';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

const Home = () => {
  const [user, setUser] = useState(null);
  const signer = ethers.Wallet.createRandom();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          // Enable MetaMask provider
          await window.ethereum.enable();

          // Create a signer from MetaMask provider
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          // Initialize user with PushAPI
          const initializedUser = await PushAPI.initialize(signer, { env: 'staging' });

          // Set the user in state
          setUser(initializedUser);

          console.log('User Initialized:', initializedUser);
        } else {
          console.error('MetaMask not found. Please install MetaMask.');
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };

    initializeUser();
  }, []);

  const toWalletAddress = ethers.Wallet.createRandom().address;


  const [sentMessages, setSentMessages] = useState([]);
  useEffect(() => {
    const sendMessageToBob = async () => {
      try {
        // Send a message to Bob using userAlice
        const aliceMessagesBob = await user.chat.send(toWalletAddress, {
          content: "Hello Bob!",
          type: "Text",
        });

        // Log the result or perform any other actions based on the response
        console.log('Message sent to Bob:', aliceMessagesBob.messageObj);
        setSentMessages((prevMessages) => [
          ...prevMessages,
          aliceMessagesBob.messageObj,
        ]);

      } catch (error) {
        console.error('Error sending message to Bob:', error);
      }
    };

    sendMessageToBob();
  }, [user]);


  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        // Fetch chat messages from userAlice
        const aliceChats = await user.chat.list("CHATS");
        console.log('Alice chats:', aliceChats);

        // Update the state with the fetched chat messages
        setChatMessages(aliceChats);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchChatMessages();
  }, [user]); // The empty dependency array ensures that this effect runs only once on component mount

  useEffect(() => {
    const initializeStream = async () => {
      try {
        // Check if user is initialized
        if (!user) {
          console.error('User not initialized.');
          return;
        }

        // Initialize Stream
        const chatStream = await user.initStream([CONSTANTS.STREAM.CHAT]);

        // Configure stream listen events and what to do
        chatStream.on(CONSTANTS.STREAM.CHAT, (message) => {
          // console.log('Received chat message:', message);
          // Add logic to update state or perform actions based on the received message
        });

        // Connect Stream
        chatStream.connect();
      } catch (error) {
        console.error('Error initializing chat stream:', error);
      }
    };

    initializeStream();
  }, [user]); // Include 

  // Rest of your component code

  return (
    <div>
      {/* Render your component content */}
      <ul>
        {sentMessages.map((message, index) => (
          <li key={index}>
            <p>{message.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
