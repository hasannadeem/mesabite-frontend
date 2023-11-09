import { BrowserRouter } from "react-router-dom";

export const renderComponentWithRouter = ({ Component, props }) => (
  <BrowserRouter>
    <Component {...props} />
  </BrowserRouter>
);
