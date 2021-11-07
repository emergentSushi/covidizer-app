const DataTable = ({header, nodes}) => {
    return (<table>
        <thead>
            <tr>
                <th>{header}</th>
            </tr>
        </thead>
        <tbody>
            {
                nodes?.map((r) => (
                    <tr key={r.id}>
                        <td>{r.name}</td>
                    </tr>
                ))
            }
        </tbody>
    </table>);
}

export default DataTable;