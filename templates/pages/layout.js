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
                <Navbar expand="md">
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
            <Container fluid className="ps-0">
                <Row>
                    <Col md="2" lg="2" xl="2">
                        <Offcanvas className="leftsidebar bg-light pt-2" show={ showSideBar } onHide={ handleSidebarClose }
                            placement="start"
                            responsive="md">
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>PikPak</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Container fluid className="p-0">
                                    <Nav activeKey="1" className="flex-column">
                                        <Nav.Link as={ Link } className="nav-link" to="/home" onClick={ handleSidebarClose } ><Icon icon="plus" size="6" className="me-1" />Home</Nav.Link>
                                        <Nav.Link as={ Link } className="nav-link" to="/" onClick={ handleSidebarClose }><Icon icon="menu" size="6" className="me-1" />Root</Nav.Link>
                                    </Nav>
                                </Container>

                            </Offcanvas.Body>
                        </Offcanvas>
                    </Col>

                    <Col md="10" lg="10" xl="10">
                        <main>
                            <Container fluid className="pt-2">
                                { children }
                            </Container>
                        </main>
                    </Col>
                </Row>
            </Container >
        </div >
    );
}
