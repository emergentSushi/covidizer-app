import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import "./Dashlet.css";

const eventsByIndicator = gql`
	query getEventsByIndicator($indicatorId: Int!) {
		indicatorById(id: $indicatorId) {
			eventsByIndicatorId {
				nodes {
					id
					indicatorId
					seriesId
					subSeriesId
					date
					value
				}
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

const DisplayData = ({ indicator }) => {
	const [activeIndicator, setIndicator] = useState(indicator);

	const indicators = useQuery(allIndicators);
	const { data } = useQuery(eventsByIndicator, {
		variables: { indicatorId: activeIndicator },
	});

	return (
		<Card sx={{ margin: 2 }} variant="outlined">
			<CardContent>
				<InputLabel id="demo-simple-select-label">Indicator</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					label="Indicator"
					value={indicator}
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
				<ResponsiveContainer width="95%" height={400}>
					<LineChart width={600} height={400} data={data?.indicatorById?.eventsByIndicatorId?.nodes}>
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
