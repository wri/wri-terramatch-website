import _ from "lodash";
import { defaultTheme, RaThemeOptions } from "react-admin";

export const theme = _.merge<RaThemeOptions, RaThemeOptions>(defaultTheme, {
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input:focus": {
            boxShadow: "none"
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          a: {
            color: theme.palette.primary.main
          }
        })
      }
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" }
    },
    MuiSelect: {
      defaultProps: { variant: "outlined" }
    },
    //@ts-ignore
    RaCreate: {
      styleOverrides: {
        root: {
          maxWidth: "1024px",
          margin: "0 auto 24px auto",
          width: "100%"
        }
      }
    },
    RaEdit: {
      styleOverrides: {
        root: {
          maxWidth: "1024px",
          margin: "0 auto 24px auto",
          width: "100%"
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .RaArrayInput-label span": {
            ...theme.typography.h5,
            color: theme.palette.text.primary
          },
          "& .RaArrayInput-label": {
            marginTop: theme.spacing(2.5)
          }
        })
      }
    },
    RaSimpleFormIterator: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          marginTop: theme.spacing(1.5) + " !important"
        })
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiAccordionSummary-content button": {
            ...theme.typography.body1,
            textAlign: "left"
          }
        })
      }
    }
  }
});
