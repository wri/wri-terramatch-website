import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';

const VideoPreview = (props) => {
  const {title, subtext, src, videoAttributes, className} = props;
  const [ playing, setPlaying ] = useState(false);
  const videoEl = useRef(null);

  const playVideo = () => {
    setPlaying(true);
    // Reset video
    videoEl.current.currentTime = 0;
    // Play
    videoEl.current.play();
  };

  const onVideoKeyDown = (e) => {
    if (e.keyCode === 13) {
      playVideo();
    }
  };

  return (
    <div className={`${className} c-video-preview__wrapper`}>
      {!playing && <div onClick={playVideo}
           onKeyDown={onVideoKeyDown}
           role="button"
           tabIndex="0"
           className="c-video-preview__overlay u-text-bold u-flex u-flex--centered u-flex--justify-centered u-flex--column">
        <div className="c-video-preview__overlay-content u-text-center">
          {title && <p className="u-font-primary u-text-ellipsis u-margin-top-none">{title}</p>}
          <div role="presentation" className="c-icon c-icon--play c-video-preview__play-icon"/>
          {subtext && <p className="u-font-primary u-margin-bottom-none">{subtext}</p>}
        </div>
      </div> }
      <video ref={videoEl}
             preload="metadata"
             className="c-video-preview__preview"
             controls={playing}
             {...videoAttributes}>
        <source src={`${src}#t=2`} type="video/mp4" />
      </video>
    </div>
  );
};

VideoPreview.propTypes = {
  title: PropTypes.string,
  subtext: PropTypes.string,
  src: PropTypes.string.isRequired,
  videoAttributes: PropTypes.object
};

VideoPreview.defaultProps = {
  title: '',
  subtext: '',
  videoAttributes: {}
};

export default VideoPreview;
