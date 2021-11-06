const DataTable = (props) => {
    return (<table>
        <thead>
            <tr>
                <th>{props.header}</th>
            </tr>
        </thead>
        <tbody>
            {
                props.nodes?.map((r) => (
                    <tr key={r.id}>
                        <td>{r.name}</td>
                    </tr>
                ))
            }
        </tbody>
    </table>);
}

export default DataTable;