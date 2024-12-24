const Layout = ({ children }) => {
    useEffect(() => {
        // 组件挂载时执行的代码（相当于 componentDidMount）
        const download_handler = (e) => {
            layer.alert(e.a);
        };
        onEvent('downloads', download_handler);
        return () => {
            offEvent('downloads', download_handler);
        };
    }, []); // 空数组表示只在挂载和卸载时执行

    const [showSideBar, setShowSideBar] = useState(false);
    const handleSidebarClose = () => setShowSideBar(false);
    const handleSidebarShow = () => setShowSideBar(true);
    const toggleSidebar = () => { setShowSideBar(!showSideBar); }

    return (
        <div>
            <header>
                <HeaderNav onClick={ handleSidebarShow } />
            </header >
            <Container fluid>
                <Row>
                    <Col md="2" lg="2" xl="2" className="ps-0">
                        <SideBar show={ showSideBar } onHide={ handleSidebarClose } closeSideBar={ handleSidebarClose } />
                    </Col>
                    <Col xs="12" sm="12" md="10" lg="10" xl="10">
                        <main>
                            <Container fluid className="pt-2 px-0">
                                { children }
                            </Container>
                        </main>
                    </Col>
                </Row>
            </Container >
        </div >
    );
}
