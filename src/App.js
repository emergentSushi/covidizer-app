import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";

import './App.css';
import DebugData from './Debug';
import DisplayData from "./DisplayData";

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/debug">Debug</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<DisplayData />}>
            </Route>
            <Route path="/debug" element={<DebugData />}>
            </Route>
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
