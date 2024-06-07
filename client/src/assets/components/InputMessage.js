export default function InputMessage({style, content, handleChange, placeholder}){
    const theStyle = style ? ('-' + style) : '';
    return (
        <textarea className={'input-message' + theStyle} value={content} onChange={handleChange} placeholder={placeholder}/>
    )
}