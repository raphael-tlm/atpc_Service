export default function Link({to, children, style}){
    const theStyle = (style) ? '-'+style : '';
    return (
        <a href={to} className={'a'+theStyle}>{children}</a>
    )
} 