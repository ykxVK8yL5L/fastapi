const getUsers = () => {
    const { response, error, loading, fetchData } = useAxios();
    const fetchDataByPage = async ({ page }) => {
        fetchData({
            url: `${ API_URL }?page=${ page }`,
            method: "GET",
        });
    };
    return { response, error, loading, fetchDataByPage };
}