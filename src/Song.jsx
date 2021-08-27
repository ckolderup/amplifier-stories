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
        <p>
          {story?.artist || "Unknown"} - {story?.title || "Unknown"}
        </p>
      </div>
    </a>
  );
}

export default Story;
