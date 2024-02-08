import React, { useState, useEffect } from 'react';
import './App.css';
import RemoteGame from './RemoteGame.js';
import LocalGame from './LocalGame.js';
// import { socket } from './socket';

function App() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastOpponentTurn, setLastOpponentTurn] = useState(null);
  const [isLocalMode, setIsLocalMode] = useState(true);

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
  const toggleMode = () => {
    setIsLocalMode(!isLocalMode);
  };

  return (
    <div className="App">
      <header className="App-header" >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ margin: 5 }}>Pack It!</h1>
          <button className='howTo' onClick={() => alert("1) Pack It! is a two-player game where players take turns placing rectangular tiles on the board.\n2) In turn number i, a tile is placeable if it has area i or i+1.\n3) Whenever a player has no placeable tiles, the other player wins!\n4) To place a rectangular tile, first click on one of the corners of the rectangle, and then on the other corner (this means that if it's a 1x1 tile you must click twice on its cell!). \n\n Game idea by Thomas Garrison. Code by Bernardo Subercaseaux.")}>
            how to play 🤔
            {/* <img src={qmark} className="qMark" alt="logo" /> */}
          </button>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'row', alignContent: 'center',
          alignItems: 'center'
        }} >
          <p> Current mode: {isLocalMode ? 'local' : 'remote'} </p>
          <button onClick={toggleMode} style={{ height: 20, marginLeft: 20 }}>
            Switch to {isLocalMode ? 'remote' : 'local'} mode
          </button>
        </div>

        {
          <LocalGame />
          // isLocalMode ? <LocalGame /> : <RemoteGame messages={messages}
          //   broadcastMove={broadcastMove} lastOpponentTurn={lastOpponentTurn} />
        }
        {/* <p>Game idea 💡 by Thomas Garrison. Code 🧑🏻‍💻 by Bernardo Subercaseaux.</p> */}
      </header>
    </div>
  );
}

export default App;
