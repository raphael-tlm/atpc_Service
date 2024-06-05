export default function Navigation({ children, style, cutFrom }){
    const theStyle = (style !== undefined) ? '-'+style : '';
    let index = 0;
    cutFrom = Number(cutFrom);
    return(
        <nav className={'nav'+theStyle}>
            {
                children.map(child => {
                    if(index != cutFrom){
                        index++;
                        
                        return child;
                    }
                    else
                    {
                        index++;
                        return(
                            <div className={'nav'+theStyle+'-cut'}>
                                {child}
                            </div>
                        )
                    }
                })
            }
        </nav>
    )
}