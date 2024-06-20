import React from 'react'
import { useState } from 'react';

export default function MessageList({data, users, id, refpointer}) {
    const [lastreadset, setLastreadset] = useState(false);

    function messages(key, content, id, uid, name = null, read=null) {
        let side = id==uid ? 'right' : 'left';
        const theMessage = () =>{
            return (
                <>
                {name ? <div className={'name '+side}>{name}</div> : ''}
                <div data-index={key} className={'message '+side}>
                    <div className='content'>{content}</div>
                </div>
                </>
            )
        }
        if(read == uid && !lastreadset){
            console.log('last read set');
            console.log(content)
            setLastreadset(true);
            return (
                <>
                {theMessage()}
                <div ref={refpointer}></div>
                </>
            )
        }
        else{
            return theMessage();
        }
    }

    return (
        <>
            {data.map((message, index) => {
                if(index == 0){
                    const user = users.find(user => user.Id_Utilisateur === message.Id_Utilisateur);
                    return messages(index, message.Contenu.replaceAll('<br>', ' \n ').replaceAll('\\n', '\n'), message.Id_Utilisateur, id, user.Prenom+' '+user.Nom, message.read);
                }
                else{
                    const user = users.find(user => user.Id_Utilisateur === message.Id_Utilisateur);
                    if (data[index-1].Id_Utilisateur === message.Id_Utilisateur) {
                        return messages(index, message.Contenu.replaceAll('<br>', ' \n ').replaceAll('\\n', '\n'), message.Id_Utilisateur, id, null, message.read);
                    }
                    return messages(index, message.Contenu.replaceAll('<br>', ' \n ').replaceAll('\\n', '\n'), message.Id_Utilisateur, id, user.Prenom+' '+user.Nom, message.DernierVue_Id_Utilisateur);
                }
            })}
        </>
    )
}
