import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import Stories from 'react-insta-stories';
import Song from './Song'

import './StoryFrame.css'

const XButton = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="white" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
  </svg>
)

const PlayButton = () => (
  <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="200px" viewBox="0 0 24 24" width="200px" fill="#4caad8">
    <g>
      <rect fill="none" height="24" width="24"/>
    </g>
    <g>
      <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M9.5,16.5v-9l7,4.5L9.5,16.5z"/>
    </g>
  </svg>
)

export default function StoryFrame({date, musicService}) {
  const history = useHistory();
  const [size, setSize] = React.useState({width: 720, height: 1080});
  const [playing, setPlaying] = React.useState(false);
  const [stories, setStories] = React.useState([]);
  const [notes, setNotes] = React.useState('');

  function finishStory() {
    setPlaying(false);
  }

  function startStory() {
    setPlaying(true);
  }

  function updateWindowDimensions() {
    setSize({width: window.innerWidth, height: window.innerHeight})
  }

  const loading = stories && stories.length < 1;
  const loadingFailed = !loading && stories[0].type == 'error';

  React.useEffect(() => {
    async function fetchData() {
      const data = await fetch(`data/${date}.json`,
        { headers: { 'Content-Type': 'application/json',
          'Accept': 'application/json'}
        }).then((res) =>
          res.json()
        ).catch((error) => {
          console.log(error);
          return {
            stories: [
              {
                type: 'error',
                url: 'https://placekitten.com/720/1280',
                header: {
                  heading: 'oops! there was a problem. Taking you back shortly!'
                }
              }
            ]
          }
        });


      if (!!data?.notesFile) {
        const notes = await fetch(data?.notesFile,
          { headers: { 'Content-Type': 'text/plain',
          'Accept': 'text/plain'}
        }).then((res) =>
          res.text()
        ).catch((error) => {
          console.log(error);
          return ''
        });
        setNotes(notes);
      } else if (!!data?.notes) {
        setNotes(data?.notes);
      }

      setStories(data.stories);
    }

    fetchData();

    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);

    return function cleanup() {
      window.removeEventListener('resize', updateWindowDimensions);
    }
  }, [])

  const hasMissingUrls = stories.some((s) => !s.links[musicService].length);

  return (
    <div>
      {playing ? (
        <div className='story-container'>
          <button className='close' onClick={finishStory}>
            <XButton />
          </button>
          <Stories
            stories={stories}
            width={size.width}
            height={size.height}
            keyboardNavigation
            onAllStoriesEnd={finishStory}
          />
        </div>
      ) : (
        <div className='story-page'>
          <div
            className={`play-story ${loading ? "loading" : ""} ${
              loadingFailed ? "error" : ""
            }`}
            onClick={!loading && !loadingFailed ? startStory : undefined}
          >
            {stories &&
              stories.map((story, i) => (
                <div
                  key={story?.url}
                  style={{
                    backgroundImage: `url(${story?.thumbnailUrl})`,
                    animation: `slide ${stories.length * 5}s infinite`,
                    animationDelay: `${i * 5}s`,
                  }}
                ></div>
              ))}
            <PlayButton />
          </div>
          <div className='story-content'>
            {loading && !loadingFailed && (
              <div className='throbber'>Loading...</div>
            )}
            {loadingFailed && <div className='throbber'>Failed to load</div>}
            {!loading && !loadingFailed && (
              <>
                <div
                  className='missing-warning'
                  style={{ visibility: hasMissingUrls ? "visible" : "hidden" }}
                >
                  Note: some of the songs below are not available on your
                  selected music service. Sorry!
                </div>
                <h3>Songs in this Story</h3>
                <ol>
                  {stories.map((story) => (
                    <li key={story.url}>
                      <Song musicService={musicService} story={story} />
                    </li>
                  ))}
                </ol>
                {notes?.length > 0 && (
                  <>
                    <h3>Notes</h3>
                    <div className='notes'><ReactMarkdown>{notes}</ReactMarkdown></div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
