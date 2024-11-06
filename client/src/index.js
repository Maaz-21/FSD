/*Entry point for a React application*/ 
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>      {/*StrictMode is a tool for highlighting potential problems in an application*/}
    <Provider store={store}>       {/*The <Provider> component makes the Redux store available to any nested components*/}
      <PersistGate persistor={persistor}>   {/*The <PersistGate> component delays the rendering of your app's UI until your persisted state has been retrieved and saved to redux*/}
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
