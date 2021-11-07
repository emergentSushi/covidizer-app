import DisplayData from "./DisplayData";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { useQuery, gql } from "@apollo/client";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

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
			<Grid item xs={12}>
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
									}}
								>
                                    <MenuItem key={0} value={0} disabled={true}>Please select...</MenuItem>
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
									}}
								>
                                    <MenuItem key={0} value={0} disabled={true}>Please select...</MenuItem>
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
                                    <MenuItem key={0} value={0} disabled={true}>Please select...</MenuItem>
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
			{dashLets.map((d, i) => (
				<Grid item key={i} xs={12} md={6}>
					<DisplayData indicator={d.indicator} series={d.series} subSeries={d.subSeries} index={i} close={() => onCloseDashlet(i, dashLets)} />
				</Grid>
			))}
		</Grid>
	);
};

export default Dash;
