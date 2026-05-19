import { ChangeEvent, RefObject, TextareaHTMLAttributes, useEffect, useRef } from "react";

export const useTextAreaAuto = (
  handleChange: (evt: ChangeEvent<HTMLTextAreaElement>) => void,
  value: string = ""
): {
  value: string | number | readonly string[] | undefined;
  handleChange: (evt: ChangeEvent<HTMLTextAreaElement>) => void;
  textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref: RefObject<HTMLTextAreaElement | null> };
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

  const textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref: RefObject<HTMLTextAreaElement | null>;
  } = {
    onChange: handleChange,
    ref: textAreaRef
  };

  return { value, handleChange, textareaProps };
};
