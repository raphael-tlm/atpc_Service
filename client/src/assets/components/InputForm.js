import React from 'react'

export default function InputForm({title, type, name, placeholder, label = false, data, setData}) {
  function Label() {
    return <label className={'form-'+title+'-label'} htmlFor={name}>{label}</label>
  }

  return (
        <div className={'form-' + title + '-inputandlabel'}>
            {label ? <Label /> : null }
            <input className={'form-'+title+'-input'} type={type} name={name} placeholder={placeholder} value={data} onChange={(e) => setData(e.target.value)}/>
        </div>
  )
}
