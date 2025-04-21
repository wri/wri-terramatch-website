import { Box, Container, createTheme, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Create a basic theme for the standalone page
const theme = createTheme({
  palette: {
    primary: {
      main: "#2E3C48" // Using Terramatch primary color
    },
    background: {
      default: "#FFFFFF"
    }
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
  }
});

// A standalone page that uses the StandaloneStack from _app.tsx
const ProjectViewer: NextPage = () => {
  const router = useRouter();
  const [projectUuid, setProjectUuid] = useState<string | null>(null);

  useEffect(() => {
    // Print "Hello World" to the console when the page loads
    console.log("Hello World");

    if (router.isReady) {
      const { projectUuid } = router.query;
      setProjectUuid(projectUuid as string);
    }
  }, [router.isReady, router.query]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Project Viewer | Terramatch</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxWidth="lg" sx={{ p: 4, minHeight: "100vh" }}>
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Hello World
          </Typography>
          {projectUuid && (
            <Typography variant="body1" sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              Project UUID: {projectUuid}
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ProjectViewer;
