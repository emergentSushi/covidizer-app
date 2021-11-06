import DisplayData from "./DisplayData";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const initialDashletData = [
	{
		indicator: 1,
		name: "1",
	},
	{
		indicator: 2,
		name: "2",
	},
	{
		indicator: 3,
		name: "3",
	},
];

const Dash = () => {
	const [dashlets, setDashlets] = useState(initialDashletData);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={6}>
				<DisplayData indicator={"1"} />
			</Grid>
			<Grid item xs={12} md={6}>
				<DisplayData indicator={"2"} />
			</Grid>
			<Grid item xs={12} md={6}>
				<DisplayData indicator={"3"} />
			</Grid>
		</Grid>
	);
};

export default Dash;
