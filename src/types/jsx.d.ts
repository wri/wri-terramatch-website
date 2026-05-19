/* eslint-disable @typescript-eslint/no-unused-vars */

// Fixes react incompatibility issue with some old libs (like react-admin)
// TODO: Try removing when react-admin has been taken out of the repo
declare namespace JSX {
  export import IntrinsicElements = React.JSX.IntrinsicElements;
  export import Element = React.JSX.Element;
}
