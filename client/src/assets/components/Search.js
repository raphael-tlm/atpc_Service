import React from 'react'
import InputForm from './InputForm'

export default function Search({title, ph, data, setData, search, setSearch, selected, setSelected, isMulti}) {
  return (
    <>
        <InputForm title={title} type='text' name='research' placeholder={ph} data={search} setData={setSearch} />
        <div className={'form-'+title+'-research-list'}>
            <div className='form-newdiscussion-research-list-item'>
                <input type='checkbox' id='all' name='all' value='all' onChange={(e) => {
                    if(e.target.checked){
                        setSelected(data);
                    }
                    else{
                        setSelected([]);
                    }
                }
                } />
                <label htmlFor='all'>Tout selectionner</label>
            </div>
            {data.filter((user) => {
                if(search === ''){
                    return false;
                }
                return user.label.toLowerCase().includes(search.toLowerCase());
            }).map((user) => {
                return (
                    <div key={user.value} className='form-newdiscussion-research-list-item'>
                        <input type='checkbox' id={user.value} name={user.value} value={user.value} onChange={(e) => {
                            if(isMulti){
                                if(e.target.checked){
                                    setSelected([...selected, {value: e.target.value, label: user.label}]);
                                }else{
                                    setSelected(selected.filter((item) => item.value !== e.target.value));
                                }
                            }else{
                                setSelected([{value: e.target.value, label: user.label}]);
                            }
                        }} />
                        <label htmlFor={user.value}>{user.label}</label>
                    </div>
                )
            }
            )}
        </div>
    </>
  )
}
