import DisplayData from "./DisplayData";
import React, { useState } from "react";

import { useQuery, gql } from "@apollo/client";
import { Grid, InputLabel, MenuItem, Select, Card, CardContent, Button } from "@mui/material/";

import TextField from "@mui/material/TextField";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";

const allIndicators = gql`
	query {
		allIndicators {
			nodes {
				id
				name
			}
		}
	}
`;

const allSeries = gql`
	query seriesForIndicator($indicatorId: Int!) {
		allSeries(condition: { indicatorId: $indicatorId }) {
			nodes {
				id
				name
			}
		}
	}
`;

const allSubSeries = gql`
	query subSeriesForSeries($seriesId: Int!) {
		allSubSeries(condition: { seriesId: $seriesId }) {
			nodes {
				id
				name
			}
		}
	}
`;

const Dash = () => {
	const [activeIndicator, setIndicator] = useState(0);
	const [activeSeries, setSeries] = useState(0);
	const [activeSubSeries, setSubSeries] = useState(0);
	const [dashLets, setDashlets] = useState([]);

	const [startDate, setStartDate] = useState(moment());
	const [endDate, setEndDate] = useState(moment());

	const onCloseDashlet = (index) => {
		setDashlets(dashLets.filter((d, i) => index !== i));
	};

	const indicators = useQuery(allIndicators);
	const series = useQuery(allSeries, {
		variables: { indicatorId: activeIndicator },
	});
	const subseries = useQuery(allSubSeries, {
		variables: { seriesId: activeSeries },
	});

	const addNewDashlet = (indicator, series, subSeries) => {
		setDashlets([...dashLets, { indicator, series, subSeries }]);
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={6}>
				<Card sx={{ margin: 2 }} variant="outlined">
					<CardContent>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<InputLabel id="indicator-select-label">Indicator</InputLabel>
								<Select
									labelId="indicator-select-label"
									label="Indicator"
									value={activeIndicator}
									onChange={(e) => {
										setIndicator(parseInt(e.target.value));
										setSeries(0);
										setSubSeries(0);
									}}
								>
									<MenuItem key={0} value={0} disabled={true}>
										Please select...
									</MenuItem>
									{indicators.data?.allIndicators?.nodes?.map((i) => (
										<MenuItem key={i.id} value={i.id}>
											{i.name}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid item xs={12}>
								<InputLabel id="series-select-label">Series</InputLabel>
								<Select
									labelId="series-select-label"
									label="Series"
									value={activeSeries}
									onChange={(e) => {
										setSeries(parseInt(e.target.value));
										setSubSeries(0);
									}}
								>
									<MenuItem key={0} value={0} disabled={true}>
										Please select...
									</MenuItem>
									{series?.data?.allSeries?.nodes.map((i) => (
										<MenuItem key={i.id} value={i.id}>
											{i.name}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid item xs={12}>
								<InputLabel id="sub-series-select-label">Sub-Series</InputLabel>
								<Select
									labelId="sub-series-select-label"
									label="Sub-Series"
									value={activeSubSeries}
									onChange={(e) => {
										setSubSeries(parseInt(e.target.value));
									}}
								>
									<MenuItem key={0} value={0} disabled={true}>
										Please select...
									</MenuItem>
									{subseries?.data?.allSubSeries?.nodes.map((i) => (
										<MenuItem key={i.id} value={i.id}>
											{i.name}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid item xs={12}>
								<Button
									variant="contained"
									onClick={() => addNewDashlet(activeIndicator, activeSeries, activeSubSeries)}
									disabled={activeIndicator === 0 || activeSeries === 0 || activeSubSeries === 0}
								>
									Add
								</Button>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} md={6}>
				<Card sx={{ margin: 2 }} variant="outlined">
					<CardContent>
						<Grid container spacing={2}>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<Grid item xs={12}>
									<DatePicker
										label="Start Date"
										value={startDate}
										onChange={(newValue) => {
											setStartDate(newValue);
										}}
										renderInput={(params) => <TextField {...params} />}
									/>
								</Grid>
								<Grid item xs={12}>
									<DatePicker
										label="End Date"
										value={endDate}
										onChange={(newValue) => {
											setEndDate(newValue);
										}}
										renderInput={(params) => <TextField {...params} />}
									/>
								</Grid>
							</LocalizationProvider>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
			{dashLets.map((d, i) => (
				<Grid item key={i} xs={12} md={6}>
					<DisplayData
						indicator={d.indicator}
						series={d.series}
						subSeries={d.subSeries}
						index={i}
						close={() => onCloseDashlet(i, dashLets)}
						startDate={startDate}
						endDate={endDate}
					/>
				</Grid>
			))}
		</Grid>
	);
};

export default Dash;
