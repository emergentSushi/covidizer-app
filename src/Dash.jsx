import DisplayData from "./DisplayData";
import React, { useState } from "react";

import { useQuery, gql } from "@apollo/client";
import { Grid, InputLabel, MenuItem, Select, Card, CardContent, Button, FormControl } from "@mui/material/";

import TextField from "@mui/material/TextField";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";
import DashSlot from "./DashSlot";

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

const DASHBOARD_MAX_SIZE = 6;

const Dash = () => {
	const [activeIndicator, setIndicator] = useState(0);
	const [activeSeries, setSeries] = useState(0);
	const [activeSubSeries, setSubSeries] = useState(0);
	const [dashLets, setDashlets] = useState([]);

	const [startDate, setStartDate] = useState(moment('2020-03-01'));
	const [endDate, setEndDate] = useState(moment('2021-02-15'));

	const onCloseDashlet = (index) => {
		setDashlets(dashLets.filter((d, i) => index !== i));
	};

	const createTitle = (dashLet, indicators, series, subseries) => {
		const titleParts = [
			indicators.data?.allIndicators?.nodes.filter((x) => x.id == dashLet.indicator)[0]?.name,
			series?.data?.allSeries?.nodes.filter((x) => x.id == dashLet.series)[0]?.name,
			subseries?.data?.allSubSeries?.nodes.filter((x) => x.id == dashLet.subSeries)[0]?.name,
		];

		return titleParts.join(", ");
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
								<FormControl fullWidth>
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
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
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
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
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
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<Button
									variant="contained"
									onClick={() => addNewDashlet(activeIndicator, activeSeries, activeSubSeries)}
									disabled={
										activeIndicator === 0 ||
										activeSeries === 0 ||
										activeSubSeries === 0 ||
										dashLets.length > 5
									}
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
										minDate={moment('2020-03-01')}
										maxDate={moment('2021-02-15')}
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
										minDate={moment('2020-02-15')}
										maxDate={moment('2021-02-15')}
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
			{Array.from({ length: DASHBOARD_MAX_SIZE }, (_, i) => i).map((_, i) => (
				<Grid item key={i} xs={12} md={6}>
					{i < dashLets.length && (
						<DisplayData
							indicator={dashLets[i].indicator}
							series={dashLets[i].series}
							subSeries={dashLets[i].subSeries}
							index={i}
							close={() => onCloseDashlet(i, dashLets)}
							startDate={startDate}
							endDate={endDate}
							title={createTitle(dashLets[i], indicators, series, subseries)}
						/>
					)}
					{i >= dashLets.length && <DashSlot />}
				</Grid>
			))}
		</Grid>
	);
};

export default Dash;
