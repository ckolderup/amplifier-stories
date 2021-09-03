import React, { useState } from 'react'
import { HashRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom'
import StoryFrame from './StoryFrame'
import './App.css'
import index from '../public/data/index.json'

function Tile({date: dateString}) {
  const date = new Date(dateString);

  return(
    <Link to={dateString} className="tile">
      <div className="month">
        {date.toLocaleString('default', {month: 'short'})}
      </div>
      <div className="day">
        {date.getUTCDate()}
      </div>
      <div className="year">
        {date.getFullYear()}
      </div>
    </Link>
  )
}

export default function App() {
  // TODO: store service choice in localStorage
  const [musicService, setMusicService] = useState(localStorage.getItem('musicService') || 'spotify');

  function updateMusicService(serviceName) {
    localStorage.setItem('musicService', serviceName);
    setMusicService(serviceName);
  }

  return (
    <div className='App'>
      <Router>
        <div className='header'>
          <div className='header-inner'>
            <Link to='/'>
              <img src="/img/amplifier-wide.png" alt="Amplifier"/>
            </Link>
          </div>
        </div>
        <Switch>
          <Route
            path='/:a(\d{4}-\d{2}-\d{2})'
            render={(data) => (
              <div className='Story'>
                <StoryFrame
                  musicService={musicService}
                  date={data.match.params.a}
                />
              </div>
            )}
          />
          <Route path='/'>
            <ul className='tiles'>
              {index.map((date) => (
                <Tile key={date} date={date} />
              ))}
            </ul>
          </Route>
        </Switch>
      </Router>
      <div className='footer'>
        <h3>Open links with</h3>
        <ul className='playlists'>
          <li>
            <button onClick={() => updateMusicService("appleMusic")}>
              <img
                className={musicService == "appleMusic" ? "chosen" : ""}
                src='/img/apple-music.png'
                alt='Apple Music'
              />
            </button>
          </li>
          <li>
            <button onClick={() => updateMusicService("spotify")}>
              <img
                className={musicService == "spotify" ? "chosen" : ""}
                src='/img/spotify.png'
                alt='Spotify'
              />
            </button>
          </li>
          <li>
            <button onClick={() => updateMusicService("youtube")}>
              <img
                className={musicService == "youtube" ? "chosen" : ""}
                src='/img/youtube.png'
                alt='YouTube'
              />
            </button>
          </li>
        </ul>
        <hr/>
        <p>A project by <a href="https://casey.kolderup.org">Casey Kolderup</a></p>
      </div>
    </div>
  );
}
