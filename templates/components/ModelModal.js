const ModelModal = (props) => {
    const [create, setCreate] = useState(true);
    const [name, setName] = useState("");
    const [fields, setFields] = useState([]);
    const [field, setField] = useState({ name: "", type: "string" });

    const handleShow = () => {
        if (Object.keys(props.model).length > 0) {
            setCreate(false)
            setName(props.model.model_name);
            setFields(Object.entries(props.model.fields).map(([key, value]) => ({
                name: key,
                type: value
            })));
        } else {
            setCreate(true)
            setName("");
            setFields([]);
        }
    }


    const saveModel = () => {
        if (create) {
            createModel(name, fields);
        } else {
            updateModelFields(name, fields);
        }
    };

    const handleAddField = () => {
        if (field.name.trim().length < 1) {
            layer.msg('请正确填写内容', { icon: 5 });
            return false;
        }
        setFields([...fields, field]);
        setField({ name: "", type: "string" });
    }

    return (
        <Modal show={ props.show } onShow={ handleShow } onHide={ props.onHide }>
            <Modal.Header closeButton onHide={ props.onHide }>
                <Modal.Title>{ create ? "新建" : "编辑" }模型</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control readOnly={ !create } disabled={ !create } placeholder="模型名称[英文小写]" value={ name } onChange={ (e) => setName(e.target.value) } />
                        <InputGroup className="my-2">
                            <Form.Control placeholder="字段名称[英文小写]" value={ field.name } onChange={ (e) => setField({ ...field, name: e.target.value }) } />
                            <Col xs="4">
                                <Form.Select value={ field.type } onChange={ (e) => setField({ ...field, type: e.target.value }) }>
                                    <option value="string">String</option>
                                    <option value="text">Text</option>
                                    <option value="int">Int</option>
                                    <option value="bool">Bool</option>
                                    <option value="float">Float</option>
                                </Form.Select>
                            </Col>
                            <Button variant="secondary" onClick={ handleAddField }>
                                添加
                            </Button>
                        </InputGroup>
                    </Form.Group>
                </Form>
                <ListGroup>
                    { fields.map((field, index) => (
                        <ListGroup.Item className="d-flex justify-content-between"><span className="d-flex justify-content-center align-items-center">{ field.name }【{ field.type }】</span><Icon onClick={ () => { setFields(fields.filter((_, i) => i !== index)) } } icon="delete-outline" size="3" className="text-black" /></ListGroup.Item>
                    )) }
                </ListGroup>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={ () => { props.onHide() } }>
                    关闭
                </Button>
                <Button variant="primary" onClick={ () => { saveModel(); props.onHide(); props.onSave() } }>
                    保存
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
