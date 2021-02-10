export const getHeaderGradient = (backgroundUrl) => {
  let style = 'linear-gradient(195deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7))';
  if (backgroundUrl) {
    style += `, url(${backgroundUrl})`;
  }
  return style;
}
