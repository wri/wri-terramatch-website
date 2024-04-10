export interface InputVariant {
  name?: string;
  input?: string;
  label?: string;
  content?: string;
  description?: string;
  texArea?: string;
}

export const INPUT_LOGIN_VARIANT: InputVariant = {
  name: "LOGIN",
  input: `h-full relative z-[1] bg-transparent border-b-2 hover:border-blue-300
          border-grey-400 hover:shadow-inset-blue w-full input-login
          pb-3.5`,
  label: `opacity-50 text-blue-300 text-blue-700 origin-left
          transition-transform duration-[0.3s,color] delay-[0.3s]
          absolute label-login`,
  content: `content-login w-full`
};

export const INPUT_SIGNUP_VARIANT: InputVariant = {
  name: "SIGNUP",
  input: `p-3 border border-grey-400 rounded-xl w-full hover:border-blue-300
          hover:shadow-blue-border text-dark-700 opacity-60`,
  label: `text-14-light text-dark-500`,
  content: `flex flex-col gap-1`,
  description: `text-12-light text-dark-500 text-dark-200`
};

export const INPUT_MODAL_VARIANT: InputVariant = {
  name: "SIGNUP",
  input: `p-3 border border-grey-400 rounded-lg w-full hover:border-blue-300
         text-dark-500 disabled:bg-grey-700 disabled:cursor-not-allowed`,
  label: `text-14-light text-dark-500`,
  content: `flex flex-col gap-1`,
  description: `text-12-light text-dark-500 text-dark-200`,
  texArea: `p-3 border border-grey-400 rounded-lg w-full hover:border-blue-300
         text-dark-500 resize-none`
};
