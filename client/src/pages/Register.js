import { useState } from 'react';

import Input from '../assets/components/Input';
import Button from '../assets/components/Button';
import Aside from '../assets/components/Aside';
import Link from '../assets/components/Link';

import '../assets/css/register.css';

export default function Register(){
    localStorage.clear();

    const [ mail, setMail ] = useState('');
    const [ password, setPassword ] = useState(''); 
    const [ prenom, setPrenom ] = useState('');
    const [ nom, setNom ] = useState('');
    
    function handleRegister(){
        try{
            if(mail === '') throw 'Veuillez entrer un mail';
            if(password === '') throw 'Veuillez entrer un mot de passe';
            if(prenom === '') throw 'Veuillez entrer un prénom';
            if(nom === '') throw 'Veuillez entrer un nom';
            fetch('http://localhost:7596/TryRegister?mail=' + mail + '&password=' + password + '&prenom=' + prenom + '&nom=' + nom)
            .then(response => response.json())
            .then(data => {
                if(data.token){
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('x2', data.x2);
                    localStorage.setItem('x3', data.x3);
                    localStorage.setItem('x0', data.x0);
                    localStorage.setItem('x1', data.x1);
                    localStorage.setItem('x4', data.x4);
                    window.location.href = '/';
                } else {
                    alert(data.message || data.err || 'Erreur inconnue');
                }
            });
        }
        catch(e){
            alert(e);
        }
    }  
    
    function transition(){
        const form = document.querySelector('.register-form');
        document.querySelector('.img-register').style.zIndex = '1';
        form.style.zIndex = '0';
        form.classList.add('transition');
    }


    return(
        <div className='register-page'>
            <div className="main-content">
            <div className="register-form">
                <div>
                    <div><Input style='register' placeholder="Nom . . ." label="Votre nom : " value={nom} change={(i) => setNom(i.target.value)} type='text'/></div>
                    <div><Input style='register' placeholder="Prénom . . ." label="Votre prénom :" value={prenom} change={(i) => setPrenom(i.target.value)} type='text'/></div>
                </div>
                <Input style="register" placeholder="monMail@atpc.asso.fr" label="Entrez votre E-Mail :" value={mail} change={(e) => setMail(e.target.value)} type='text'/>
                <Input style="register" placeholder="monMotDePasseIci" label="Entrez votre mot de passe :" value={password} change={(i) => setPassword(i.target.value)} type='password'/>
                <Button click={() => handleRegister()} style="register">S'inscrire</Button>
                <Aside style="register">
                    <Button click={() => transition()} style="register">
                        <Link to="/login" style="register">Se connecter</Link>    
                    </Button> 
                </Aside>
            </div>
            <img className='img-register' src={require('../assets/images/logo.png')}/>
            </div>
        </div>
    )
}