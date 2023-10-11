const style = {
    display: 'flex',
    justifyContent: "flex-start",
    alignItem:'center',
    margin:'10px 0'
}
export default function FlexStart({children}) {

    return (
        <div style={style}>
            {children}
        </div>
    )
}