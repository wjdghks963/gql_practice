import { createBrowserRouter } from "react-router-dom";
import Movie from "./routes/Movie";
import Moives from "./routes/Movies";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Moives />,
    // children: [{ path: "/:id", element: <Movie /> }],
  },
  { path: "/movies/:id", element: <Movie /> },
]);
