import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './App.css';
import RemoteGame from './RemoteGame.js';
import LocalGame from './LocalGame.js';
import AIGame from './AIGame.js';
import CuteButton from './CuteButton.js';
// import { socket } from './socket';


function App() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastOpponentTurn, setLastOpponentTurn] = useState(null);
  const [mode, setMode] = useState("solitaire");
  const [userStart, setUserStarts] = useState(null);
  //const [AIStart, setAIStarts] = handleUserStarts(null);




  // for the modal
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserTurnModalOpen, setIsUserTurnModalOpen] = useState(false);
  

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  /*

  const handleUserStarts = () => {
    setUserStarts(true);
    setIsModalOpen(false);
  };

  const handleAIStarts = () => {
    setUserStarts(false);
    setIsModalOpen(false);
  };
  */
    
  const handleWhoStarts = (userStarts) => {
    setIsUserTurnModalOpen(false);

    if (userStarts) {
      console.log("User starts the game. Make your first move!");
      
    } else {
      console.log("AI starts the game");
      // AIMove(); 

    }
    
  };
    
  
  const howToPlayContent = (
    <>
      <h2>How to Play</h2>
      <p>
        <ol>
        <li> Pack It! is a two-player game where players take turns placing rectangular tiles on the board. </li>
        <li> In turn number i, a tile is placeable if it has an area of i or i+1. </li>
        <li> Whenever a player has no placeable tiles, the other player wins!</li>
        <li> To place a rectangular tile, first click on one of the corners of the rectangle, and then on the other corner (this means that if it's a 1x1 tile you must click twice on its cell!). </li>
        </ol>
        <br /><br />
        Game idea by Thomas Garrison. Code by Bernardo Subercaseaux and Abigail Kamenetsky
        
      </p>
    </>
  );
  
  // useEffect(() => {
  //   function onConnect() {
  //     console.log('connected');
  //     setIsConnected(true);
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }

  //   function onTurnEvent(turn) {
  //     console.log(turn);
  //     setLastOpponentTurn(turn);
  //     //setMessages(previous => [...previous, value]);
  //     // this.game.onOpponentTurn(value);
  //     ///setFooEvents(previous => [...previous, value]);
  //   }

  //   socket.on('connect', onConnect);
  //   socket.on('disconnect', onDisconnect);
  //   socket.on('turn', onTurnEvent);

  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //     socket.off('turn', onTurnEvent);
  //   };
  // }, []);

  // const broadcastMove = (move) => {
  //   // send turn to server
  //   socket.emit('turn', move);
  // }


  // State to track whether the mode is local (true) or remote (false)


  // Function to toggle the mode


  console.log('isModalOpen:', isModalOpen);

  const opModal = (event) => {
    console.log("opModal");
    openModal(howToPlayContent);

  }; 

  return (
    <div className="App">
      <header className="App-header" >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ margin: 5 }}>Pack It!</h1>

          
        </div>

        <div style={{
          display: 'flex', flexDirection: 'row', alignContent: 'center',
          alignItems: 'center'
        }} >

          <CuteButton text={"How to Play"} color={"#CBE3C3"} style = {{color: "#000"}} onClick={opModal} />    
          <CuteButton text={"Solitaire Mode"} color={"#CBE3C3"} style = {{color: "#000"}} onClick = {() => {setMode("solitaire")}}  />
          {/* get rid of "player 1" for solitaire mode */}
          {/* remove print board / developer mode for print board */}
          {/* turn alerts into modals, get rid of green color for 1 */}

          <CuteButton text={"2 Players (coming soon)"} color={"#CDCDCD"} style={{ color: "#000", opacity: 0.5, pointerEvents: 'none' }} />

          
          <CuteButton text={"AI mode"} color={"#CBE3C3"} style={{ color: "#000" }} onClick={() => {setIsUserTurnModalOpen(true); setMode("AI")}} />

        



        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          {modalContent}
        </Modal>

        <Modal isOpen={isUserTurnModalOpen} closeModal={() => setIsUserTurnModalOpen(false)}>
          <h2>Who starts the game?</h2>
          <div>
            <CuteButton text="User" color="#CBE3C3" style={{ color: "#000", marginRight: "10px" }} onClick={() => handleWhoStarts(true)} />
            <CuteButton text="AI" color="#CBE3C3" style={{ color: "#000" }} onClick={() => handleWhoStarts(false)} />
          </div>
        </Modal>

          {/* <p> Current mode: {isLocalMode ? 'local' : 'remote'} </p>
          {/* <button onClick={toggleMode} style={{ height: 20, marginLeft: 20 }}> */}
            {/* Switch to {isLocalMode ? 'remote' : 'local'} mode */}
          {/* </button> */}
        </div>
        {/* cute_button */}

        {
          // A ? B : C -- if a is true, does b, if not, c
          mode==="solitaire" ? <LocalGame /> : <AIGame />
        }
        {/* <p>Game idea 💡 by Thomas Garrison. Code 🧑🏻‍💻 by Bernardo Subercaseaux.</p> */}
      </header>
    </div>
  );
}

export default App;
