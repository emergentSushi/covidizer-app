import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import "./Dashlet.css";

const eventsQuery = gql`
	query getEvents($indicatorId: Int!, $seriesId: Int!, $subSeriesId: Int!) {
		allEvents(condition: { indicatorId: $indicatorId, seriesId: $seriesId, subSeriesId: $subSeriesId }) {
			nodes {
				date
				value
			}
		}
	}
`;

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
	query {
		allSeries {
			nodes {
				id
				name
			}
		}
	}
`;

const allSubSeries = gql`
	query {
		allSubSeries {
			nodes {
				id
				name
			}
		}
	}
`;

const DisplayData = ({ selectedIndicator, selectedSeries, selectedSubseries }) => {
	const [activeIndicator, setIndicator] = useState(selectedIndicator);
	const [activeSeries, setSeries] = useState(selectedSeries);
	const [activeSubSeries, setSubSeries] = useState(selectedSubseries);

	const indicators = useQuery(allIndicators);
	const series = useQuery(allSeries);
	const subseries = useQuery(allSubSeries);

	const { data } = useQuery(eventsQuery, {
		variables: { indicatorId: activeIndicator, seriesId: activeSeries, subSeriesId: activeSubSeries },
	});

	return (
		<Card sx={{ margin: 2 }} variant="outlined">
			<CardContent>
				<InputLabel id="indicator-select-label">Indicator</InputLabel>
				<Select
					labelId="indicator-select-label"
					label="Indicator"
					value={activeIndicator}
					onChange={(e) => {
						setIndicator(parseInt(e.target.value));
					}}
				>
					{indicators.data?.allIndicators?.nodes?.map((i) => (
						<MenuItem key={i.id} value={i.id}>
							{i.name}
						</MenuItem>
					))}
				</Select>

				<InputLabel id="series-select-label">Series</InputLabel>
				<Select
					labelId="series-select-label"
					label="Series"
					value={activeSeries}
					onChange={(e) => {
						setSeries(parseInt(e.target.value));
					}}
				>
					{series?.data?.allSeries?.nodes.map((i) => (
						<MenuItem key={i.id} value={i.id}>
							{i.name}
						</MenuItem>
					))}
				</Select>

				<InputLabel id="sub-series-select-label">Sub-Series</InputLabel>
				<Select
					labelId="sub-series-select-label"
					label="Sub-Series"
					value={activeSubSeries}
					onChange={(e) => {
						setSubSeries(parseInt(e.target.value));
					}}
				>
					{subseries?.data?.allSubSeries?.nodes.map((i) => (
						<MenuItem key={i.id} value={i.id}>
							{i.name}
						</MenuItem>
					))}
				</Select>

				<ResponsiveContainer width="95%" height={400}>
					<LineChart width={600} height={400} data={data?.allEvents?.nodes}>
						<Line type="monotone" dataKey="value" stroke="#8884d8" />
						<XAxis dataKey="name" />
						<YAxis />
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export default DisplayData;
