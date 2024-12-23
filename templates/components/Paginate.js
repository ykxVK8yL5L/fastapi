
const Paginate = (props) => {
    const page = props.page;
    const pageCount = Math.ceil(props.totalCount / props.itemsPerPage);

    return (
        <div className="d-flex justify-content-center align-items-baseline">
            <span className="text-info me-2">{ page }/{ pageCount }</span>
            <Pagination>
                { (pageCount > 1 && page > 1) && <Pagination.First onClick={ () => { props.onClick(1) } } /> }
                { (pageCount > 1 && page > 1) && <Pagination.Prev onClick={ () => { props.onClick(page - 1) } } /> }
                { (pageCount > 1 && page < pageCount) && <Pagination.Next onClick={ () => { props.onClick(page + 1) } } /> }
                { (pageCount > 1 && page < pageCount) && <Pagination.Last onClick={ () => { props.onClick(pageCount) } } /> }
            </Pagination>
        </div>
    )
}

//<Paginate page={page} onClick={(i) => { setPage(i) }} itemsPerPage="10" totalCount="100" />