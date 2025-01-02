const ModelItemModal = (props) => {
    const [create, setCreate] = useState(true);
    const [fields, setFields] = useState([]);
    const [model, setModel] = useState({});
    const [item, setItem] = useState({});

    const handleShow = () => {
        if (Object.keys(props.model).length > 0) {
            setModel(props.model)
            setFields(Object.entries(props.model.fields).map(([key, value]) => ({
                name: key,
                type: value
            })));
        } else {
            setFields([]);
        }

        if (Object.keys(props.item).length > 0) {
            setItem(props.item)
            setCreate(false)
        } else {
            setItem({})
            setCreate(true)
        }

    }


    const saveModelItem = () => {
        if (create) {
            createModelItem(model.model_name, item);
        } else {
            updateModelItem(model.model_name, item);
        }
    };


    const handelItemChange = (field_name, value) => {
        setItem({ ...item, [field_name]: value })
    }


    return (
        <Modal show={ props.show } onShow={ handleShow } onHide={ props.onHide }>
            <Modal.Header closeButton onHide={ props.onHide }>
                <Modal.Title>{ create ? "新建" : "编辑" }{ model.model_name }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    { !create && <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>ID:</Form.Label>
                        <Form.Control placeholder="ID" readOnly disabled value={ item.id } />
                    </Form.Group> }

                    { fields.map((field, index) => {
                        switch (field.type) {
                            case 'bool':
                                return (
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{ field.name }:</Form.Label>
                                        <Col sm="12">
                                            <Form.Check
                                                inline
                                                label="true"
                                                name={ field.name }
                                                type="radio"
                                                value="1"
                                                checked={ item[field.name] == 1 }
                                                onClick={ () => { handelItemChange(field.name, true) } }
                                            />
                                            <Form.Check
                                                inline
                                                label="false"
                                                name={ field.name }
                                                type="radio"
                                                value="0"
                                                checked={ item[field.name] == 0 }
                                                onClick={ () => { handelItemChange(field.name, false) } }
                                            />
                                        </Col>
                                    </Form.Group>

                                )
                                break;
                            case 'text':
                                return (
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{ field.name }:</Form.Label>
                                        <Form.Control as="textarea" value={ item[field.name] } placeholder={ field.name } onChange={ (e) => { handelItemChange(field.name, e.target.value) } } />
                                    </Form.Group>
                                )
                                break;
                            default:
                                return (
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{ field.name }</Form.Label>
                                        <Form.Control placeholder={ field.name } value={ item[field.name] } onChange={ (e) => { handelItemChange(field.name, e.target.value) } } />
                                    </Form.Group>
                                )
                                break;
                        }
                    }) }

                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={ () => { setItem({}); props.onHide() } }>
                    关闭
                </Button>
                <Button variant="primary" onClick={ () => { saveModelItem(); setItem({}); props.onHide(); props.onSave() } }>
                    保存
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
