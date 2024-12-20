const IconButton = (props) => {
    return (
        <Button onClick={ props.onClick } className={ props.className }>
            <span className={ `mdi mdi-${ props.icon } fs-${ props.iconSize } ${ props.iconClassName }` }></span>
            { props.text }
        </Button>
    );
}
