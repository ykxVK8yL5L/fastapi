
const ModelItems = () => {
    const location = useLocation()
    const { id } = useParams()
    const { response, error, loading, fetchModelById } = getModel();
    const { response: items_re, error: items_err, loading: items_loading, fetchDataByPage } = getModelItems();
    const [show, setShow] = useState(false);
    const [reload, setReload] = useState(false);
    const [model, setModel] = useState({});
    const [modelItem, setModelItem] = useState({});
    const [query, setQuery] = useState({ page: 1, size: 50 });
    const tcolumns = [
        { title: 'ID', dataIndex: 'id' },
    ];
    const [columns, setColumns] = useState([]);

    const forceUpdate = () => {
        setReload((pre) => !pre);
    }

    useEffect(() => {
        fetchModelById(id)
        onEvent('deleteModelItemCallBack', forceUpdate);
        return () => {
            offEvent('deleteModelItemCallBack', forceUpdate);
        };
    }, []);

    useEffect(() => {
        if (response) {
            setModel(response)
            var model_cloumns = [];
            Object.entries(response.fields).map(([key, value]) => {
                model_cloumns.push({ title: key, dataIndex: key, render: (row) => { if (value == "bool") { return JSON.stringify(row[key]) } else { return row[key]; } } });
            });
            tcolumns.splice(1, 0, ...model_cloumns);
            tcolumns.push({ title: '操作', dataIndex: 'id', render: (row) => <span><IconButton onClick={ () => { handelEditModelItem(row); } } className="bg-teal border-0 me-1" icon="pencil-outline" iconClassName="text-white" iconSize="6" /><IconButton onClick={ () => { emitEvent("deleteModelItem", { "model_name": response.model_name, "id": row.id, "callback": forceUpdate }); } } className="bg-teal border-0" icon="delete-outline" iconClassName="text-white" iconSize="6" /></span> })
            setColumns(tcolumns);
        }
        return () => {
        }
    }, [response]);

    useEffect(() => {
        if (Object.keys(model).length > 0) {
            fetchDataByPage(model.model_name, query)
        }
        return () => { }
    }, [model, query, reload]);



    const handelEditModelItem = useCallback((item) => {
        setModelItem(item);
        setShow(true);
    }, []);


    return (
        <div>
            { loading && <Alert variant="info" dismissible>Loading...</Alert> }
            { error && <Alert variant="danger" dismissible>{ error }</Alert> }
            <div>
                <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-light">
                    <label className="fs-3">模型内容管理</label>
                    <ButtonToolbar aria-label="功能区" className="bg-teal rounded">
                        <ButtonGroup className="bg-teal">
                            <IconButton onClick={ () => { setShow(true); } } text="新增" className="bg-teal border-0" icon="delete-outline" iconClassName="me-1 text-white" iconSize="6" />
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <Container fluid className="p-2">
                    <ModelItemModal show={ show } onHide={ () => { setShow(false) } } model={ model } item={ modelItem } onSave={ () => { fetchDataByPage(model.model_name, query); } } />
                    { (items_re && ('items' in items_re)) && <DataTable data={ items_re.items } columns={ columns } /> }
                    { (items_re && ('total' in items_re)) && <Paginate page={ query.page } onClick={ (i) => { setQuery({ ...query, page: i }) } } itemsPerPage="20" totalCount={ items_re.total } /> }
                </Container>
            </div>
        </div >
    );
}
