import React from 'react';

import './Song.css'

const Story = ({story, musicService}) => {
  if (!story) {
    return (<></>)
  }

  return (
    <a href={story?.links?.[musicService]}>
      <div className='container'>
        <img className='thumbnail' src={story?.thumbnailUrl} />
        <div className='title'>
          {story?.title || "Unknown"}
        </div>
        <div className='artist'>
          {story?.artist || "Unknown"}
        </div>
      </div>
    </a>
  );
}

export default Story;
