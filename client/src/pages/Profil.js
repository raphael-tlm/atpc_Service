import React, { useState } from 'react'
import HandlePage from '../assets/components/HandlePage'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider';
import LabelEdit from '../assets/components/LabelEdit';

export default function Profil() {
    const auth = useAuth();

    const [pass, setPass] = useState('');
    const [newPass, setNewPass] = useState('');

  return (
    <HandlePage title="Profil" nav={auth}>
        <h1>Profil</h1>
        <div className="profil">
            <div className="profil-info">
                <div className="profil-info-item">
                    <LabelEdit label="Nom : " data={auth.name} setData={(e) => {auth.setName(e.target.value)}} />
                    <button onClick={() => {auth.update('Nom', auth.name, auth.id)}}>✓</button>
                </div>
                <div className="profil-info-item">
                    <LabelEdit label="Prenom : " data={auth.firstName} setData={(e) => {auth.setFirstName(e.target.value)}} />
                    <button onClick={() => {auth.updateName(auth.name, auth.id)}}>✓</button>
                </div>
                <div className="profil-info-item">
                    <LabelEdit label="EMail : " data={auth.email} setData={(e) => {auth.setEmail(e.target.value)}} />
                    <button onClick={() => {auth.updateName(auth.mail, auth.id)}}>✓</button>
                </div>
            </div>
            <div className="profil-pass">
                <LabelEdit label="Mot de passe : " data={pass} setData={(e) => {setPass(e.target.value)}} hide />
                <LabelEdit label="Re-écrivez le mot de passe : " data={newPass} setData={(e) => {setNewPass(e.target.value)}} hide/>
                <button onClick={() => {if(pass !== newPass){
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
