import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import "./Dashlet.css";

const eventsQuery = gql`
	query getEvents($indicatorId: Int!, $seriesId: Int!, $subSeriesId: Int!, $startDate: Date!, $endDate: Date!) {
		allEvents(
			condition: { indicatorId: $indicatorId, seriesId: $seriesId, subSeriesId: $subSeriesId }
			filter: { date: { lessThanOrEqualTo: $endDate, greaterThanOrEqualTo: $startDate } }
		) {
			nodes {
				date
				value
			}
		}
	}
`;

const DisplayData = ({ indicator, series, subSeries, close, startDate, endDate }) => {
	const { data } = useQuery(eventsQuery, {
		variables: { indicatorId: indicator, seriesId: series, subSeriesId: subSeries, startDate, endDate },
	});

	return (
		<Card sx={{ margin: 2 }} variant="outlined">
			<CardContent>
				<IconButton onClick={close}>
					<Close />
				</IconButton>
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
