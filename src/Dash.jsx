import DisplayData from "./DisplayData";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";

const Dash = () => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={6}>
				<DisplayData selectedIndicator={1} selectedSeries={1} selectedSubseries={1} />
			</Grid>
			<Grid item xs={12} md={6}>
				<DisplayData selectedIndicator={2} selectedSeries={3} selectedSubseries={5} />
			</Grid>
			<Grid item xs={12} md={6}>
				<DisplayData selectedIndicator={2} selectedSeries={3} selectedSubseries={4} />
			</Grid>
		</Grid>
	);
};

export default Dash;
