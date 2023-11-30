import { ArrowBack } from "@mui/icons-material";
import { Link } from "react-admin";
import { Link as RouterLink, useLocation } from "react-router-dom";

export const getBackLink = (pathname: string) => {
  const pathArr = pathname.split("/")?.filter(path => !!path);
  let to = [];

  if (pathArr.length === 3 || pathArr.includes("show")) {
    to = pathArr.slice(0, 1);
  } else if (pathArr.length > 3) {
    to = pathArr.slice(0, 2);
  } else {
    to = pathArr.slice(0, pathArr.length - 1);
  }

  return `/${to.join("/")}`;
};

export const BackButton = () => {
  const { pathname } = useLocation();

  return (
    <Link component={RouterLink} variant="button" to={getBackLink(pathname)} aria-label="Go back">
      <ArrowBack />
    </Link>
  );
};
