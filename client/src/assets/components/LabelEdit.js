import React from 'react'

export default function LabelEdit({label, data, setData, hide=false}) {
    return (
        <div className="label-edit">
            <label>{label}</label>
            <input type={hide ? "password" : "text"} value={data} onChange={setData} />
        </div>
    )
}
