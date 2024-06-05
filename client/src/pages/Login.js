import React, { useState } from 'react';

import Input from '../assets/components/Input';
import Button from '../assets/components/Button';
import Aside from '../assets/components/Aside';
import Link from '../assets/components/Link';

import '../assets/css/login.css';

export default function Login(){

    const [ mail, setMail ] = useState('');
    const [ password, setPassword ] = useState(''); 

    return (
        <div className="login-page">
            <div className="main-content">
                <img src={require('../assets/images/logo.png')}/>
                <form className="login-form">
                    <Input style="login" placeholder="monMail@atpc.asso.fr" label="Entrez votre E-Mail :" value={mail} change={(e) => setMail(e.target.value)} type='text'/>
                    <Input style="login" placeholder="monMotDePasseIci" label="Entrez votre mot de passe :" value={password} change={(i) => setPassword(i.target.value)} type='password'/>
                    <Button click={() => console.log('wip')} style="login">Se connecter</Button>
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