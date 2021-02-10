export const numberOnlyKeyDown = (e) => {
  if (e.keyCode === 69 || e.keyCode === 189 || e.keyCode === 173 || e.keyCode === 187) { // numbers only.. (not -,+ or e)
    e.preventDefault();
    return;
  }
}
