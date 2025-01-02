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


    const handelItemChange = (field_name, e) => {
        setItem({ ...item, [field_name]: e.target.value })
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
                                        <Form.Label>{ field.name }</Form.Label>
                                        <Form.Check
                                            inline
                                            label="true"
                                            name={ field.name }
                                            type="radio"
                                            value="true"
                                            checked={ item[field.name] == "true" }
                                            onClick={ (e) => { handelItemChange(field.name, e) } }
                                        />
                                        <Form.Check
                                            inline
                                            label="false"
                                            name={ field.name }
                                            type="radio"
                                            value="false"
                                            checked={ item[field.name] == "false" }
                                            onClick={ (e) => { handelItemChange(field.name, e) } }
                                        />
                                    </Form.Group>

                                )
                                break;
                            case 'text':
                                return (
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{ field.name }</Form.Label>
                                        <Form.Control as="textarea" value={ item[field.name] } placeholder={ field.name } onChange={ (e) => { handelItemChange(field.name, e) } } />
                                    </Form.Group>
                                )
                                break;
                            default:
                                return (
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{ field.name }</Form.Label>
                                        <Form.Control placeholder={ field.name } value={ item[field.name] } onChange={ (e) => { handelItemChange(field.name, e) } } />
                                    </Form.Group>
                                )
                                break;
                        }
                    }) }

                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={ () => { props.onHide() } }>
                    关闭
                </Button>
                <Button variant="primary" onClick={ () => { saveModelItem(); props.onHide(); props.onSave() } }>
                    保存
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
