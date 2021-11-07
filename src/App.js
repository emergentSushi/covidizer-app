import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";
import Dash from "./Dash";
import DebugData from "./Debug";

const client = new ApolloClient({
	uri: "http://localhost/graphql",
	cache: new InMemoryCache(),
});

function App() {
	return (
		<DndProvider backend={HTML5Backend}>
			<ApolloProvider client={client}>
				<CssBaseline />
				<Router>
					<div className="App">
						<nav className="App-header">
							<div>
								<Link to="/">Home</Link>
							</div>
							<div>
								<Link to="/debug">Debug</Link>
							</div>
						</nav>
						<Routes>
							<Route path="/" element={<Dash />}></Route>
							<Route path="/debug" element={<DebugData />}></Route>
						</Routes>
					</div>
				</Router>
			</ApolloProvider>
		</DndProvider>
	);
}

export default App;
