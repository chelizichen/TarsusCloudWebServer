const style = {
    display: 'flex',
    justifyContent: "space-between",
    margin:'10px 0'
}
export default function SpaceBetween({children}) {

    return (
        <div style={style}>
            {children}
        </div>
    )
}