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
        if(mail === ''){
            alert('Veuillez entrer un mail');
        } 
        else{
            if(password === ''){
                alert('Veuillez entrer un mot de passe');
            }
            else{
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
        }
    }

    return (
        <div className="login-page">
            <div className="main-content">
                <img src={require('../assets/images/logo.png')}/>
                <form className="login-form">
                    <Input style="login" placeholder="monMail@atpc.asso.fr" label="Entrez votre E-Mail :" value={mail} change={(e) => setMail(e.target.value)} type='text'/>
                    <Input style="login" placeholder="monMotDePasseIci" label="Entrez votre mot de passe :" value={password} change={(i) => setPassword(i.target.value)} type='password'/>
                    <Button click={() => handleLogin()} style="login">Se connecter</Button>
                    <Link to="/forgotPWD" style="login">Mot de passe oublié</Link>
                    <Aside style="login">
                        <Button click={() => console.log('wip')} style="login">
                            <Link to="/register" style="login">S'inscrire</Link>    
                        </Button> 
                    </Aside>
                </form>
            </div>
        </div>
    )
}