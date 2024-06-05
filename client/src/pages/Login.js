import React, { useState } from 'react';

import Input from '../assets/components/Input';
import Button from '../assets/components/Button';
import Aside from '../assets/components/Aside';
import Link from '../assets/components/Link';

import '../assets/css/login.css';

export default function Login(){
    localStorage.clear();

    const [ mail, setMail ] = useState('');
    const [ password, setPassword ] = useState(''); 

    //seting the token in the local storage
    function handleLogin(){
        try{
            if(mail === '') throw 'Veuillez entrer un mail';
            if(password === '') throw 'Veuillez entrer un mot de passe';
            fetch('http://localhost:7596/TryLogin?mail=' + mail + '&password=' + password)
            .then(response => response.json())
            .then(data => {
                if(data.token){
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('mail', mail);
                    localStorage.setItem('prenom', data.prenom);
                    localStorage.setItem('nom', data.nom);
                    localStorage.setItem('id', data.id);
                    localStorage.setItem('statut', data.statut);
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
        const form = document.querySelector('.login-form');
        document.querySelector('.img-login').style.zIndex = '1';
        form.style.zIndex = '0';
        form.classList.add('transition');
    }

    return (
        <div className="login-page">
            <div className="main-content">
                <img className='img-login' src={require('../assets/images/logo.png')}/>
                <form className="login-form">
                    <Input style="login" placeholder="monMail@atpc.asso.fr" label="Entrez votre E-Mail :" value={mail} change={(e) => setMail(e.target.value)} type='text'/>
                    <Input style="login" placeholder="monMotDePasseIci" label="Entrez votre mot de passe :" value={password} change={(i) => setPassword(i.target.value)} type='password'/>
                    <Button click={() => handleLogin()} style="login">Se connecter</Button>
                    <Link to="/forgotPWD" style="login">Mot de passe oublié</Link>
                    <Aside style="login">
                        <Button click={() => transition()} style="login">
                            <Link to="/register" style="login">S'inscrire</Link>    
                        </Button> 
                    </Aside>
                </form>
            </div>
        </div>
    )
}