export default function Selection({style, data, setData, selected, setSelected, title, titleSelected, allowAll =false}){
    const theStyle = style ? ('-' + style) : '';

    const reset = (e) => {
        e.target.value = '';
    }
    
    return (
        <>
            <select className={'selection-selected' + theStyle} onChange={(e) =>{
                if(e.target.value === ''){
                    return;
                }
                if(e.target.value === 'x'){
                    setData([... data, ... selected]);
                    setSelected([]);
                    reset(e);
                    return;
                }
                setData([... data, {id: e.target.value, n: selected.find(element => element.id == e.target.value).n, c: selected.find(element => element.id == e.target.value).c}]);
                setSelected(selected.filter(element => element.id !== e.target.value));
                reset(e);
            }}>
                <option value=''>{titleSelected}</option>
                {allowAll ? (<option value='x'>Retirer tout le monde</option>) : ''}
                {selected && selected.map((element, index) => {
                    return <option key={index} value={element.id} id={"_"+element.c}>{element.n}</option>
                })}
            </select>
            <select className={'selection' + theStyle} onChange={(e) => {;
                if(e.target.value === ''){
                    return;
                }
                if(selected.find(element => element.id == e.target.value)){
                    return;
                }
                if(e.target.value === 'x'){
                    setSelected(data);
                    setData([]);
                    reset(e);
                    return;
                }
                setSelected([... selected, {id: e.target.value, n: data.find(element => element.id == e.target.value).n, c: data.find(element => element.id == e.target.value).c}]);
                setData(data.filter(element => element.id != e.target.value));
                reset(e);
            }}>
                <option value=''>{title}</option>
                {allowAll ? (<option value='x'>Ajouter tout le monde</option>) : ''}
                {data && data.map((element, index) => {
                    return <option key={index} value={element.id} id={"_"+element.c}>{element.n}</option>
                })}
            </select>
        </>
    )
}