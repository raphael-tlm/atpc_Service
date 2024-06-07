export default function Search({style , data, setData, selected, setSelected, placeholder = 'Rechercher'}){
    const theStyle = style ? ('-' + style) : '';

    return (
        <div className={'search' + theStyle}>
            <select className={'search-selected' + theStyle} onChange={(e) => { e.target.value = ''; }}>
                <option value=''>Utilisateurs sélectionnés</option>
                {selected && selected.map((element, index) => {
                    return <option key={index} value={element.id}>{element.n}</option>
                })}
            </select>
        </div>
    )
}