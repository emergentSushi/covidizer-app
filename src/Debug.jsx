import {
    useQuery,
    gql
} from "@apollo/client";
import DataTable from './DataTable';

const allSeries = gql`
query {
    allSeries {
      nodes {
        id,
        name
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

const allSubSeries = gql`
query {
    allSubSeries {
      nodes {
        id,
        name
      }
    }
  }
`;

const DebugData = (props) => {
    const series = useQuery(allSeries);
    const indicators = useQuery(allIndicators);
    const subseries = useQuery(allSubSeries);

    return (
        <>
            <DataTable header="Series" nodes={series?.data?.allSeries?.nodes}></DataTable>
            <DataTable header="Indicators" nodes={indicators?.data?.allIndicators?.nodes}></DataTable>
            <DataTable header="Sub-series" nodes={subseries?.data?.allSubSeries?.nodes}></DataTable>
        </>
    );
}

export default DebugData;