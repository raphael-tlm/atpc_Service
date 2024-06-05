export default function Input({label, placeholder, value, change, type, style}){
    const theStyle = (style) ? '-'+style : '';
    return (
        <>
            {label && <label className={'label'+theStyle}>{label}</label>}
            <input className={'input'+theStyle} type={type} placeholder={placeholder} value={value} onChange={change}/>
        </>
    )
}