const getUsers = () => {
    const { response, error, loading, fetchData } = useAxios();
    const fetchDataByPage = async (query) => {
        fetchData({
            url: `${ API_URL }`,
            method: "GET",
            data: query
        });
    };
    return { response, error, loading, fetchDataByPage };
}