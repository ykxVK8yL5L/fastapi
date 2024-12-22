const DataTable = ({ data, columns }) => {
    return (
        <Table responsive bordered>
            <thead>
                <tr className="text-center">
                    { columns.map((column, index) => (
                        <th key={ index }>{ column.title }</th>
                    )) }
                </tr>
            </thead>
            <tbody>
                { data.map((row, rowIndex) => (
                    <tr key={ rowIndex } className="text-center">
                        { columns.map((column, colIndex) => (
                            <td key={ colIndex }>
                                {/* 调用渲染方法，如果没有定义，则直接显示数据 */ }
                                { column.render ? column.render(row) : row[column.dataIndex] }
                            </td>
                        )) }
                    </tr>
                )) }
            </tbody>
        </Table>
    );
};
/**
 调用方法：
 const columns = [
        { title: 'ID', dataIndex: 'username' },
        { title: 'username', dataIndex: 'username', render: (row) => <strong>{row.username}</strong> },
      ];
<DataTable data={response} columns={columns} />
 **/