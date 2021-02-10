import React from 'react';

const ProgressRing = props => {
  const {
    radius,
    progress,
    progressMax,
    showOutOf,
    unitText,
    steps,
    cut,
    rotate,
    strokeWidth,
    fillColor,
    strokeLinecap,
    pointerRadius,
    pointerStrokeWidth,
    pointerStrokeColor,
    pointerFillColor,
    trackStrokeColor,
    trackStrokeWidth,
    trackStrokeLinecap,
    strokeColor,
    className
  } = props;

  const percentComplete = (progress / progressMax) * 100;

  const getStrokeDashoffset = strokeLength => (strokeLength / steps) * (steps - percentComplete);

  const getStrokeDashArray = (strokeLength, circumference) => `${strokeLength}, ${circumference}`;

  const getExtendedWidth = () => {
    const pointerWidth = pointerRadius + pointerStrokeWidth;
    if (pointerWidth > strokeWidth && pointerWidth > trackStrokeWidth) {
      return pointerWidth * 2;
    } else if (strokeWidth > trackStrokeWidth) {
      return strokeWidth * 2;
    } else {
      return trackStrokeWidth * 2;
    }
  };

  const diameter = 2 * radius;
  const width = diameter + getExtendedWidth();
  const circumference = 2 * Math.PI * radius;
  const strokeLength = (circumference / 360) * (360 - cut);
  const pointerAngle = ((360 - cut) / steps) * percentComplete;

  return (
    <div className={`c-progress-ring ${className}`}>
      <svg
        width={width}
        height={width}
        viewBox={`0 0 ${width} ${width}`}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {trackStrokeWidth > 0 && (
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill='#fff'
            stroke={trackStrokeColor}
            strokeWidth={trackStrokeWidth}
            strokeDasharray={getStrokeDashArray(strokeLength, circumference)}
            strokeLinecap={trackStrokeLinecap}
          />
        )}
        {strokeWidth > 0 && (
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={getStrokeDashArray(strokeLength, circumference)}
            strokeDashoffset={getStrokeDashoffset(strokeLength)}
            strokeLinecap={strokeLinecap}
          />
        )}
        {pointerRadius > 0 && (
          <circle
            cx={diameter}
            cy='50%'
            r={pointerRadius}
            fill={pointerFillColor}
            stroke={pointerStrokeColor}
            strokeWidth={pointerStrokeWidth}
            style={{
              transformOrigin: '50% 50%',
              transform: `rotate(${pointerAngle}deg) translate(${getExtendedWidth() /
                2}px)`
            }}
          />
        )}
      </svg>
      <div className='c-progress-ring__indicator'>
        <p className='u-text-bold u-font-large u-font-primary u-text-uppercase u-margin-none'>
          {showOutOf ? `${progress}/${progressMax}` : `${percentComplete}%`}
        </p>
        <p className='u-text-bold u-font-primary u-text-uppercase u-margin-none match'>
          {unitText}
        </p>
      </div>
    </div>
  );
};

ProgressRing.defaultProps = {
  radius: 100,
  progress: 0,
  progressMax: 100,
  showOutOf: false,
  steps: 100,
  cut: 0,
  rotate: -90,
  strokeWidth: 20,
  strokeColor: '#27A9E0',
  fillColor: 'none',
  strokeLinecap: 'round',
  pointerRadius: 0,
  pointerStrokeWidth: 0,
  pointerStrokeColor: '#27A9E0',
  pointerFillColor: '#27A9E0',
  trackStrokeColor: '#d0d0d0',
  trackStrokeWidth: 20,
  trackStrokeLinecap: 'round',
  unitText: '',
  className: ''
};

export default ProgressRing;
