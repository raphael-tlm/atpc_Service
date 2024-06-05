export default function Button({click,style, children}){
    const theStyle = (style) ? '-'+style : '';
    return (
        <button onClick={click} className={'button'+theStyle}>{children}</button>
    )
}