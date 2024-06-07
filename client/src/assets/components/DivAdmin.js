export default function DivAdmin({style, isAdmin, children}){
    if(isAdmin){
        return (
            <div className={'div-admin-'+style}>
                {children}
            </div>
        )
    }
    else{
        return children;
    }
}