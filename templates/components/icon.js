const Icon = (props) => {
    return (<span onClick={ props.onClick } className={ `mdi mdi-${ props.icon } fs-${ props.size } ${ props.className }` }></span>);
}
