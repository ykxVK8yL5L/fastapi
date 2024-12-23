
const Home = () => {
    const location = useLocation()
    const { id } = useParams()
    const { response, error, loading, fetchDataByPage } = getUsers();
    const [page, setPage] = useState(1);
    const [keyWord, setKeyWord] = useState("");
    const [query, setQuery] = useState({ page: page, kw: keyWord, sort: 'id' });

    useEffect(() => {
        fetchDataByPage(query);
        console.log(location);
        console.log(id);
        return () => { }//解决react18 development模式下请求两次的问题
        // 组件挂载时执行的代码（相当于 componentDidMount）
    }, [query]); // 空数组表示只在挂载和卸载时执行

    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);


    function handleKeyWordChange(e) {
        setKeyWord(e.target.value);
        console.log(keyWord);
    }


    return (
        <div>
            { loading && <Alert variant="info" dismissible>Loading...</Alert> }
            { error && <Alert variant="danger" dismissible>{ error }</Alert> }
            <div>
                <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-light">
                    <label className="fs-3">控制面板</label>
                    <ButtonToolbar aria-label="功能区" className="bg-teal rounded">
                        <ButtonGroup className="bg-teal">
                            <IconButton onClick={ () => { setOpen(!open) } } text="刷新" className="bg-teal border-0" icon="reload" iconClassName="me-1 text-white" iconSize="6" />
                            <IconButton onClick={ () => { alert("hello"); } } text="编辑" className="bg-teal border-0" icon="square-edit-outline" iconClassName="me-1 text-white" iconSize="6" />
                            <IconButton onClick={ () => { alert("hello"); } } text="删除" className="bg-teal border-0" icon="delete-outline" iconClassName="me-1 text-white" iconSize="6" />
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <Container fluid className="p-2">

                    <InputGroup>
                        <Form.Control
                            value={ keyWord } onChange={ handleKeyWordChange }
                            aria-label="Example text with button addon"
                            aria-describedby="basic-addon1"
                        />
                        <Button variant="outline-secondary" id="button-addon1" onClick={ () => { setQuery({ ...query, page: page, kw: keyWord, sort: "name" }) } }>
                            Button
                        </Button>
                    </InputGroup>


                    <Button onClick={ () => { setShow(true) } }>
                        打开
                    </Button>

                    <Button onClick={ () => { emitEvent("downloads", { "a": "b" }) } }>
                        <i className="mdi mdi-alert-box"></i>测试事件
                    </Button>

                    <Modal show={ show } onHide={ () => { setShow(false) } }>
                        <Modal.Header closeButton>
                            <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body> <span className="mdi mdi-file-document-outline"></span>Woohoo, you are reading this text in a modal!</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={ () => { setShow(false) } }>
                                Close
                            </Button>
                            <Button variant="primary" onClick={ () => { emitEvent("downloads", { "a": "点击了保存" }) } }>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Collapse in={ open }>
                        <div id="example-collapse-text">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                            terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                            labore wes anderson cred nesciunt sapiente ea proident.
                        </div>
                    </Collapse>



                    { response && <div className="text-center">{ JSON.stringify(response) }</div> }
                    <Paginate page={ page } onClick={ (i) => { setPage(i) } } itemsPerPage="10" totalCount="100" />


                </Container>
            </div>
        </div >
    );
}
