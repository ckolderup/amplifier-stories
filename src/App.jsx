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
  const [musicService, setMusicService] = useState(localStorage.getItem('musicService') || 'spotify');

  const today = new Date();
  const dates = index.filter((yyyymmdd) => today.toISOString().slice(0,10) >= yyyymmdd);

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
              <img src='/img/amplifier-wide.png' alt='Amplifier' />
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
              {dates.map((date) => (
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
        <hr />
        <p>
          By <a href='https://casey.kolderup.org'>Casey Kolderup</a> ▲ Get{" "}
          <a href='https://buttondown.email/amplifier'>email/RSS</a> ▲ Send{" "}
          <a href='mailto:casey@kolderup.org'>feedback</a>
        </p>
      </div>
    </div>
  );
}
