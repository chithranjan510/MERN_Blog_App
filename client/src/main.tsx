import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import LoginContextProvider from "./context/LoginContext.tsx";
import FilterContextProvider from "./context/filterContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <BrowserRouter>
      <LoginContextProvider>
        <FilterContextProvider>
          <App />
        </FilterContextProvider>
      </LoginContextProvider>
    </BrowserRouter>
  </ChakraProvider>
);
