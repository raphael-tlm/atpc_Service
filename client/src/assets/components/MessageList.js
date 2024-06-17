import React from 'react'

export default function MessageList({data, id}) {
    console.log(data);
    return (
        <>
            {data.map((message, index) => {
                if(message.Id_Utilisateur === id){
                    return (
                        <div key={index} className='message-right'>
                            <p>{message.Contenu}</p>
                        </div>
                    )
                }else{
                    return (
                        <div key={index} className='message-left'>
                            <p>{message.Contenu}</p>
                        </div>
                    )
                }
            })}
        </>
    )
}
