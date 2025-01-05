//设置对话框
const SettingModal = (props) => {
    const settings = [
        { "alist": [{ "label": "Alist地址", "key": "alist_host" }, { "label": "Alist令牌", "key": "alist_token" }] },
        { "github": [{ "label": "Actions地址", "key": "github_host" }, { "label": "Github令牌", "key": "github_token" }] }
    ]
    const [setting, setSetting] = useState({});
    // useEffect(() => {
    // 	localStorage.setItem('settings', JSON.stringify(setting));
    // }, [setting]);

    const loadSetting = () => {
        const storedSettings = localStorage.getItem('settings');
        if (storedSettings) {
            setSetting(JSON.parse(storedSettings));
        }
    }
    const saveSetting = () => {
        localStorage.setItem('settings', JSON.stringify(setting));
    }
    return (
        <Modal show={props.show} onHide={props.onHide} onShow={loadSetting}>
            <Modal.Header closeButton onHide={props.onHide}>
                <Modal.Title>设置</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {JSON.stringify(setting)}
                <Form>
                    {settings.map((value, index) => {
                        const key = Object.keys(value)[0];
                        const items = value[key];
                        return items.map((setting_item) => {
                            return (
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="3">
                                        {setting_item.label}
                                    </Form.Label>
                                    <Col sm="9">
                                        <Form.Control name={setting_item.key} placeholder={setting_item.label} onChange={(e) => { setSetting({ ...setting, [setting_item.key]: e.target.value }) }} />
                                    </Col>
                                </Form.Group>
                            )
                        })
                    })}
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <Button
                    variant="secondary"
                    onClick={() => {
                        props.onHide();
                    }}
                >
                    关闭
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        saveSetting();
                        props.onHide();
                        //props.onSave();
                    }}
                >
                    保存
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

//<SettingModal show={setting} onHide={() => {setSetting(false);}}/>
