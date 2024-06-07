export default function InputTitle({style, title, content, handleChange}){
    const theStyle = style ? ('-' + style) : '';
    return (
        <input className={'input-title' + theStyle} type="text" value={content} onChange={handleChange} placeholder={title}/>
    )
}