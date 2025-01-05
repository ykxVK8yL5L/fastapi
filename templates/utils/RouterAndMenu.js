const AppRouter = () => {
    return (<HashRouter>
        <Route path='/:path?'>
            <Layout>
                <Switch>
                    <Route path="/" exact component={ Model } />
                    <Route path="/home" exact component={ Home } />
                    <Route path="/models" exact component={ Model } />
                    <Route path="/models/:id?" component={ ModelItems } />
                </Switch>
            </Layout>
        </Route>
    </HashRouter>);
}


const SideBar = (props) => {
    return (
        <Offcanvas className="leftsidebar h-100 bg-light" show={ props.show } onHide={ props.onHide }
            placement="start"
            responsive="md">
            <Offcanvas.Header className="py-2 border-bottom" closeButton>
                <Offcanvas.Title>PikPak</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
                <Container fluid className="p-0">
                    <Nav activeKey="1" className="flex-column">
                        <Nav.Link as={ Link } className="nav-link text-dark" to="/" onClick={ props.closeSideBar }><Icon icon="view-dashboard-outline" size="6" className="me-2" />模型管理</Nav.Link>
                    </Nav>
                </Container>
            </Offcanvas.Body>
        </Offcanvas>
    )
}

const HeaderNav = (props) => {
    const [setting, setSetting] = useState(false);
    return (
        <Navbar expand="md">
            <Container fluid>
                <div>
                    <Navbar.Toggle className="shadow-none border-0" onClick={ props.onClick } children={ <Icon icon="menu" size="3" className="text-white" /> } />
                    <Navbar.Brand as={ Link } to="/" className="text-white">离线管理</Navbar.Brand>
                </div>
                <div className="d-flex">
                    <Button style={ { backgroundColor: "transparent" } } className="nav-link btn" onClick={ () => { setSetting(true) } } children={ <Icon icon="menu" size="3" className="text-white" /> }></Button>
                </div>
                <SettingModal
                    show={ setting }
                    onHide={ () => {
                        setSetting(false);
                    } }
                />
            </Container>
        </Navbar>
    );
}