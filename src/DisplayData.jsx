import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";
import { useDrag } from "react-dnd";
import { Card, CardContent, IconButton, CardHeader } from "@mui/material/";
import Delete from "@mui/icons-material/Delete";

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

const DisplayData = ({ indicator, series, subSeries, close, startDate, endDate, title, index }) => {
	const [{ opacity }, dragRef] = useDrag(
		() => ({
			type: "CARD",
			item: { index },
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1,
			}),
		})
	);

	const { data } = useQuery(eventsQuery, {
		variables: { indicatorId: indicator, seriesId: series, subSeriesId: subSeries, startDate, endDate },
	});

	return (
		<Card sx={{ margin: 3 }} variant="outlined" ref={dragRef} style={{ opacity }}>
			<CardContent>
				<CardHeader
					action={
						<IconButton onClick={close}>
							<Delete />
						</IconButton>
					}
					title={title}
				/>
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
