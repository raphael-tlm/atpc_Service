import React, { useEffect, useState } from 'react'
import HandlePage from '../assets/components/HandlePage'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider';
import InputForm from '../assets/components/InputForm';

import '../assets/styles/Profil.css';

export default function Profil() {
    const auth = useAuth();

    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');

    const [pass, setPass] = useState('');
    const [newPass, setNewPass] = useState('');

  return (
    <HandlePage title="profil" nav={auth}>
        <div className="profil-title">Vous êtes {auth.name} {auth.firstName}</div>
        <div className="profil">
            <div className="profil-info">
                <div className="profil-info-item">
                    <InputForm title="profil" type='text' name='nom' label="Nom : " placeholder='...' data={name} setData={setName} />
                    <button className='button-profil' onClick={() => {auth.update('Nom', name, auth.id)}}>✓</button>
                </div>
                <div className="profil-info-item">
                    <InputForm title="profil" type='text' name='prenom' label="Prénom : " placeholder='...' data={firstName} setData={setFirstName} />
                    <button className='button-profil' onClick={() => {auth.update("Prenom", firstName, auth.id)}}>✓</button>
                </div>
                <div className="profil-info-item">
                    <InputForm title="profil"type='text' label="EMail : " data={auth.email} setData={auth.setEmail} />
                    <button className='button-profil' onClick={() => {auth.update("Email", auth.mail, auth.id)}}>✓</button>
                </div>
            </div>
            <div className="profil-pass">
                <InputForm title="pass" type='text'label="Mot de passe : " data={pass} setData={setPass}/>
                <InputForm title="pass" type='password'label="Re-écrivez le mot de passe : " data={newPass} setData={setNewPass}/>
                <button className='button-pass' onClick={() => {if(pass !== newPass){
                    alert('Les mots de passe ne correspondent pas');
                    return;
                }else{
                    auth.updatePass(pass, auth.id);
                }}}>✓</button>
            </div>
        </div>
    </HandlePage> 
  )
}
