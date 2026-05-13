const wait = (time: number) => new Promise(r => setTimeout(r, time));

// re-export everything
export * from "@testing-library/react";

// override render method
export { wait };
