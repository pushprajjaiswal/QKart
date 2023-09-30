import { Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from './components/Thanks';
export const config = {
  endpoint: `${ipConfig.workspaceIp}/api/v1`,
};

function App() {
  
  return (
    <Switch>
      <Route exact path="/">
        <Products />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/checkout">
        <Checkout />
      </Route>
      <Route path="/thanks">
        <Thanks />
      </Route>
    </Switch>
  );
}

export default App;
