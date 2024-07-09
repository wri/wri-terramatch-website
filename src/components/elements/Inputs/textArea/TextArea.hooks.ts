import { useEffect, useRef } from "react";

export const useTextAreaAuto = (
  handleChange: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void,
  value: string = ""
): {
  value: string | number | readonly string[] | undefined;
  handleChange: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { ref: React.RefObject<HTMLTextAreaElement> };
} => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      const { current: textarea } = textAreaRef;
      textarea.style.height = "inherit";
      const { scrollHeight } = textarea;
      textarea.style.height = `calc(${scrollHeight}px + 2px)`;
    }
  }, [value]);

  const textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref: React.RefObject<HTMLTextAreaElement>;
  } = {
    onChange: handleChange,
    ref: textAreaRef
  };

  return { value, handleChange, textareaProps };
};
