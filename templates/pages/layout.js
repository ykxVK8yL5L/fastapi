const Layout = ({ children }) => {
    useEffect(() => {
        // 组件挂载时执行的代码（相当于 componentDidMount）
        const download_handler = (e) => {
            layer.alert(e.a);
        };
        onEvent('downloads', download_handler);
    }, []); // 空数组表示只在挂载和卸载时执行

    const [showSideBar, setShowSideBar] = useState(false);
    const handleSidebarClose = () => setShowSideBar(false);
    const handleSidebarShow = () => setShowSideBar(true);
    const toggleSidebar = () => { setShowSideBar(!showSideBar); }


    return (
        <div>
            <header>
                <Navbar expand="md" className="mb-3" >
                    <Container fluid>
                        <div>
                            <Navbar.Toggle className="shadow-none border-0" onClick={ handleSidebarShow } children={ <Icon icon="menu" size="3" className="text-white" /> } />
                            <Navbar.Brand as={ Link } to="/" className="text-white">离线管理</Navbar.Brand>
                        </div>
                        <div className="d-flex">
                            <Button style={ { backgroundColor: "transparent" } } className="nav-link btn" onClick={ () => { alert("hello") } } children={ <Icon icon="plus" size="3" className="text-white" /> }></Button>
                        </div>
                    </Container>
                </Navbar>
            </header >
            <Container fluid>

                <Row>
                    <Col md="2" lg="1">
                        <Offcanvas show={ showSideBar } onHide={ handleSidebarClose }
                            placement="start"
                            responsive="md"
                            style={ { maxWidth: "50%" } }>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>PikPak</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="flex-column justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link as={ Link } to="/" onClick={ handleSidebarClose }>Home</Nav.Link>
                                    <Nav.Link as={ Link } to="/home" onClick={ handleSidebarClose }>Link</Nav.Link>
                                </Nav>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </Col>

                    <Col md="10" lg="11">
                        <main>
                            <Container fluid>
                                { children }
                            </Container>
                        </main>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
