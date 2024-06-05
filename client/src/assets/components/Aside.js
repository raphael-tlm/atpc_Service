export default function Aside({style, children}){
    const theStyle = (style !== undefined) ? '-'+style : '';
    return (
        <div className={"aside"+theStyle}>
            {children}
        </div>
    )
}