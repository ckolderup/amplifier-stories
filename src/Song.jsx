import React from 'react';

import './Song.css'

const Story = ({story, musicService}) => {
  if (!story) {
    return (<></>)
  }

  const hasUrl = !!story?.links?.[musicService]
  const container = <div className='container'>
        <img className='thumbnail' src={story?.thumbnailUrl} />
        <div className='title'>
          {story?.title || "Unknown"}
        </div>
        <div className='artist'>
          {story?.artist || "Unknown"}
        </div>
      </div>;

  return (hasUrl ?
      <a href={story?.links?.[musicService]}>
        {container}
      </a>
    :
      container
  );
}

export default Story;
