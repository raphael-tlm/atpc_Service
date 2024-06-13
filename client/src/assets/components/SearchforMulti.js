import React, { useEffect, useState } from 'react'
import InputForm from './InputForm'

export default function SearchforMulti({title, ph, data, setData, search, setSearch, selected, setSelected, isMulti, allowAll = false}) {
    const [holder, setHolder] = useState('...');

    const [styleSelected, setStyleSelected] = useState({display: 'none'});
    const [hoverSelected, setHoverSelected] = useState(false);

    const [styleSearch, setStyleSearch] = useState({display: 'none'});
    const [hoverSearch, setHoverSearch] = useState(false);
    const [focusSearch, setFocusSearch] = useState(false);

    useEffect(() => {
        data.sort((a, b) => a.label.localeCompare(b.label));
        if(data.length === 0){
            setStyleSearch({display: 'none'});
        }
    }, [data])

    useEffect(() => {
        selected.sort((a, b) => a.label.localeCompare(b.label));
        if(selected.length === 0){
            setStyleSelected({display: 'none'});
        }
    }, [selected])

    useEffect(() => {
        if(!hoverSelected){
            setStyleSelected({display: 'none'});
        }
    }, [hoverSelected])

    useEffect(() => {
        if(!hoverSearch && !focusSearch){
            setStyleSearch({display: 'none'});
        }
        else{
            setStyleSearch({display: 'block'});
        }
    }, [hoverSearch, focusSearch])

    useEffect(() => {
        if(!isMulti){
            if(selected.length === 0){
                setHolder('...')
            }
            else{
                setHolder(selected.map((select) => select.label));
            }
        }
    }, [selected])

    return (
    <>  
        <div className={'form-'+title+'-selected'}>
            <button type="button" className={'form-'+title+'-button'} onClick={() => {setStyleSelected({display:'block'})}} onMouseEnter={()=>{setHoverSelected(true)}} onMouseLeave={()=>{setHoverSelected(false)}}>
                {
                    isMulti ? 'Selectioné(s)' :  holder
                }
            </button>
            {isMulti ? 
            <div className={'form-'+title+'-selected-list'} style={styleSelected} onMouseEnter={()=>{setHoverSelected(true)}} onMouseLeave={()=>{setHoverSelected(false)}}>
            {selected.map((select) => {
                return <div key={select.value} className={'form-'+title+'-selected-item'}>
                    <button type="button" onClick={() => {setData([...data, select])
                    setSelected(selected.filter((item) => item.value !== select.value))}}>{select.label}</button>
                </div>
            })}
        </div>
        : null}
        </div>
        <div className={'form-'+title+'-research'}>
            <InputForm title={title} type='text' name='search' placeholder={ph} data={search} setData={setSearch} onFocus={() => {setFocusSearch(true)}} onBlur={() => {setFocusSearch(false)}}/>
            <div style={styleSearch} className={'form-'+title+'-research-list'} onMouseEnter={() => (setHoverSearch(true))} onMouseLeave={() => {setHoverSearch(false)}}>
                {data.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())).map((item) => {
                    return <div key={item.value} className={'form-'+title+'-research-item'}>
                        <button type="button" onClick={() => {
                            if(isMulti){
                                setSelected([...selected, item]);
                                setData(data.filter((data) => data.value !== item.value));
                            }else{
                                setData([...selected, ...data]);
                                setSelected([item]);
                                setData(data.filter((data) => data.value !== item.value));
                            }
                            setSearch('');
                        }}>{item.label}</button>
                        </div>
                })}
            </div>
            {allowAll ? <button type="button" className={'form-'+title+'-button-all'} onClick={() => {
                    if(data.length === 0){
                        setData([...selected, ...data]);
                        setSelected([]);
                    }
                    else{
                        setSelected([...selected, ...data]);
                        setData([]);
                    }
                }}>⇆</button>
             : null
            }

        </div>
    </>
  )
}