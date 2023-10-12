const baseStyle = {
    display: 'flex',
    justifyContent: "space-between",
    margin:'10px 0'
}
export default function SpaceBetween({children,style = {}}) {

    return (
        <div style={Object.assign({},baseStyle,style)}>
            {children}
        </div>
    )
}