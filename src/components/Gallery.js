
import React from 'react';
import './gallery.css'

const Gallery = ({ memes, onMemeClick }) => {
  return (
    <div className="gallery">
    {memes.map((meme, index) => (
      <div key={index} className="meme-card" onClick={() => onMemeClick(meme)}>
        {meme.post_hint === 'image' ? (
          <img src={meme.thumbnail} alt={meme.title} />
        ) : meme.post_hint === 'hosted:video' ? (
          <video loop>
            <source src={meme.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : meme.post_hint === 'link'  && meme.url.includes('.gifv') ?(
            <video  loop>
              <source src={meme.url.replace('.gifv', '.mp4')} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
        ) : meme.post_hint === 'link' ? (
            <div>
                <img src={meme.thumbnail} alt={meme.title} />
                <a href={meme.url} target="_blank" rel="noopener noreferrer">
              Open Link
            </a>
            </div>
          ): (
            <p>Format Not Supported</p>
        ) }
        <div className="meme-details">
          <h3>{meme.title}</h3>
          <p>{`Upvotes ${meme.upvotes}   |   Comments ${meme.comments}`}</p>
        </div>
      </div>
    ))}
    </div>
  );
};

export default Gallery;