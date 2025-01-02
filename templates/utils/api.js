const getUsers = () => {
    const { response, error, loading, fetchData } = useAxios();
    const fetchDataByPage = async (query) => {
        fetchData({
            url: `${ API_URL }/users`,
            method: "GET",
            data: query
        });
    };
    return { response, error, loading, fetchDataByPage };
}

const getModels = () => {
    const { response, error, loading, fetchData } = useAxios();
    const fetchDataByPage = async (query) => {
        fetchData({
            url: `${ API_URL }/api/models/all`,
            method: "GET",
            data: query
        });
    };
    return { response, error, loading, fetchDataByPage };
}

const getModel = () => {
    const { response, error, loading, fetchData } = useAxios();
    const fetchModelById = async (id) => {
        fetchData({
            url: `${ API_URL }/api/models/` + id,
            method: "GET"
        });
    };
    return { response, error, loading, fetchModelById };
}


const getModelItems = () => {
    const { response, error, loading, fetchData } = useAxios();
    const fetchDataByPage = async (name, query) => {
        fetchData({
            url: `${ API_URL }/api/models/` + name + '/',
            method: "GET",
            data: query
        });
    };
    return { response, error, loading, fetchDataByPage };
}

const createModel = (name, fields) => {
    const loading = layer.load(1);
    var data = {}
    data.model_name = name;
    data.fields = fields;
    axios({
        method: 'post',
        url: `${ API_URL }/api/models/register_model`,
        data: data
    }).then(function (response) {
        layer.msg(response.data.message);
    }).catch(function (error) {
        console.log(error)
    }).finally(function () {
        layer.close(loading);
    });
}

const updateModelFields = (name, fields) => {
    const loading = layer.load(1);
    var data = fields;
    axios({
        method: 'put',
        url: `${ API_URL }/api/models/update_model_fields/` + name,
        data: data
    }).then(function (response) {
        layer.msg(response.data.message);
    }).catch(function (error) {
        console.log(error)
    }).finally(function () {
        layer.close(loading);
    });
}


const deleteModel = (e) => {
    layer.confirm('确认删除？操作不可撤销!', {
        btn: ['确定', '关闭'] //按钮
    }, function () {
        const loading = layer.load(1);
        axios({
            method: 'delete',
            url: `${ API_URL }/api/models/` + e.id,
        }).then(function (response) {
            layer.msg(response.data.message);
        }).catch(function (error) {
            console.log(error)
        }).finally(function () {
            layer.close(loading);
        });
        emitEvent('updateModel', {});
    }, function () {

    });
}
onEvent('deleteModel', deleteModel);


const deleteModelItem = (e) => {
    layer.confirm('确认删除？操作不可撤销!', {
        btn: ['确定', '关闭'] //按钮
    }, function () {
        const loading = layer.load(1);
        axios({
            method: 'delete',
            url: `${ API_URL }/api/models/` + e.model_name + '/' + e.id,
        }).then(function (response) {
            layer.msg(response.data.message);
        }).catch(function (error) {
            console.log(error)
        }).finally(function () {
            layer.close(loading);
            emitEvent('updateModelItems', {});
        });
    }, function () {
    });
}
onEvent('deleteModelItem', deleteModelItem);


const createModelItem = (name, item) => {
    const loading = layer.load(1);
    var data = item
    axios({
        method: 'post',
        url: `${ API_URL }/api/models/` + name,
        data: data
    }).then(function (response) {
        if (response.data.id) {
            layer.msg("添加成功");
        } else {
            layer.msg("添加失败");
        }
    }).catch(function (error) {
        console.log(error)
    }).finally(function () {
        layer.close(loading);
    });
}

const updateModelItem = (name, item) => {
    const loading = layer.load(1);
    var data = item;
    axios({
        method: 'put',
        url: `${ API_URL }/api/models/` + name + '/' + item.id,
        data: data
    }).then(function (response) {
        if (response.data.id) {
            layer.msg("更新成功");
        } else {
            layer.msg("更新失败");
        }
    }).catch(function (error) {
        console.log(error)
    }).finally(function () {
        layer.close(loading);
    });
}
