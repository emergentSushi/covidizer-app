import { LineChart, Line } from 'recharts';
import {
    useQuery,
    gql
} from "@apollo/client";
import { useState } from 'react';

const eventsByIndicator = gql`
query getEventsByIndicator($indicatorId: Int!) {
    indicatorById(id: $indicatorId)
    {
      eventsByIndicatorId {
        nodes {
          id,
          indicatorId,
          seriesId,
          subSeriesId,
          date,
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
        id,
        name
      }
    }
  }
`;

const DisplayData = (props) => {
    const [activeIndicator, setIndicator] = useState(3);

    const indicators = useQuery(allIndicators);
    const { data } = useQuery(eventsByIndicator, {
        variables: { indicatorId: activeIndicator }
    });

    return (
        <>
            <select onChange={(e) => {
                setIndicator(parseInt(e.target.value));
            }
            }>
                {
                    indicators.data?.allIndicators?.nodes?.map(i => (<option key={i.id} value={i.id}>{i.name}</option>))
                }
            </select>
            <LineChart width={400} height={400} data={data?.indicatorById?.eventsByIndicatorId?.nodes}>
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
        </>
    );
}

export default DisplayData;