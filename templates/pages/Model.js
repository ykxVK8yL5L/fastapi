
const Model = () => {
    const location = useLocation()
    const { id } = useParams()
    const { response, error, loading, fetchDataByPage } = getModels();
    const [show, setShow] = useState(false);
    const [model, setModel] = useState({});
    const [query, setQuery] = useState({ page: 1, sort: 'id' });
    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: '名称', dataIndex: 'model_name' },
        { title: '操作', dataIndex: 'id', render: (row) => <span><Link to={ `/models/` + row.id }><IconButton className="bg-teal border-0 me-1" icon="eye-outline" iconClassName="text-white" iconSize="6" /></Link> <IconButton onClick={ () => { handelEditModel(row); } } className="bg-teal border-0 me-1" icon="pencil-outline" iconClassName="text-white" iconSize="6" /><IconButton onClick={ () => { emitEvent("deleteModel", { "id": row.id }); fetchDataByPage(query); } } className="bg-teal border-0" icon="delete-outline" iconClassName="text-white" iconSize="6" /></span> },
    ];

    useEffect(() => {
        onEvent('updateModel', handelEventUpdate);
        return () => { }
    }, []);

    useEffect(() => {
        fetchDataByPage(query);
        // console.log(location);
        // console.log(id);
        return () => { }
    }, [query]); // 空数组表示只在挂载和卸载时执行

    const handelEditModel = useCallback((model) => {
        setModel(model);
        setShow(true);
    }, []);


    const handelEventUpdate = (e) => {
        fetchDataByPage(query);
    };

    return (
        <div>
            { loading && <Alert variant="info" dismissible>Loading...</Alert> }
            { error && <Alert variant="danger" dismissible>{ error }</Alert> }
            <div>
                <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-light">
                    <label className="fs-3">模型管理</label>
                    <ButtonToolbar aria-label="功能区" className="bg-teal rounded">
                        <ButtonGroup className="bg-teal">
                            <IconButton onClick={ () => { setModel({}); setShow(true); } } text="新增" className="bg-teal border-0" icon="delete-outline" iconClassName="me-1 text-white" iconSize="6" />
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <Container fluid className="p-2">
                    <ModelModal show={ show } onHide={ () => { setShow(false) } } model={ model } onSave={ () => { fetchDataByPage(query); } } />
                    { (response && ('items' in response)) && <DataTable data={ response.items } columns={ columns } /> }
                    { (response && ('total' in response)) && <Paginate page={ query.page } onClick={ (i) => { setQuery({ ...query, page: i }) } } itemsPerPage="20" totalCount={ response.total } /> }
                </Container>
            </div>
        </div >
    );
}
