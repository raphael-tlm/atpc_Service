import React, { useState } from 'react'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider'
import HandlePage from '../assets/components/HandlePage'
import InputForm from '../assets/components/InputForm'

import '../assets/styles/Register.css'

export default function Register() {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [firstName, setFirstName] = useState('')

    const auth = useAuth();

    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (mail !== "" && password !== "" && name !== "" && firstName !== "") {
            auth.registerAction({mail, password, name, firstName});
            return;
        }
        alert("Entrez des valeurs valides");
    };

    return(
        <HandlePage title='register'>
            <form className='page-register-form' onSubmit={handleSubmitEvent}>
                <div className='page-register-form-name'>
                    <InputForm title='register' type='text' name='name' placeholder='Nom...' label='Votre nom :' data={name} setData={setName}/>
                    <InputForm title='register' type='text' name='firstName' placeholder='Prénom...' label='Votre prénom :' data={firstName} setData={setFirstName}/>
                </div>
                <InputForm title='register' type='text' name='mail' placeholder='monMail@atpc.asso.fr' label='Entrez votre E-Mail :' data={mail} setData={setMail}/>
                <InputForm title='register' type='password' name='password' placeholder='monMotDePasseIci' label='Entrez votre mot de passe :' data={password} setData={setPassword}/>
                <button className='page-register-form-button'>S'inscrire</button>
                <a href='/connexion' className='page-register-form-link'>Déjà inscrit ?</a>
            </form>
            <img src={require('../assets/images/logo.png')} className='page-register-logo'/>
        </HandlePage>
    )
}
