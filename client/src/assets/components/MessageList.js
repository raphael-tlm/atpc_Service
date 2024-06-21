import React from 'react'
import { useState } from 'react';

export default function MessageList({data, users, id, refpointer}) {

    function messages(key, content, id, uid, name = null, read) {
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
        const theMessageRead = () =>{
            return (
                <>
                <div ref={refpointer} className='ref'/>
                {name ? <div className={'name '+side}>{name}</div> : ''}
                <div data-index={key} className={'message '+side}>
                    <div className='content'>{content}</div>
                </div>
                </>
            )
        }

        if (read == uid) {
            return theMessageRead();
        }
        else if (read == null) {
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
                    if (message.Id_Utilisateur === data[index-1].Id_Utilisateur && message.DernierVue_Id_Utilisateur === data[index-1].DernierVue_Id_Utilisateur || message.DernierVue_Id_Utilisateur === message.Id_Utilisateur) {
                        return messages(index, message.Contenu.replaceAll('<br>', ' \n ').replaceAll('\\n', '\n'), message.Id_Utilisateur, id, null, message.DernierVue_Id_Utilisateur);
                    }
                    return messages(index, message.Contenu.replaceAll('<br>', ' \n ').replaceAll('\\n', '\n'), message.Id_Utilisateur, id, user.Prenom+' '+user.Nom, message.DernierVue_Id_Utilisateur);
                }
            })}
        </>
    )
}
