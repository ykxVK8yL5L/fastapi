
const Home = () => {

    useEffect(() => {
        // 组件挂载时执行的代码（相当于 componentDidMount）
    }, []); // 空数组表示只在挂载和卸载时执行


    const [show, setShow] = useState(false);
    return (
        <div>
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
        </div>
    );
}
