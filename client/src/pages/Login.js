import React, {useState} from 'react'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider'

import HandelPage from '../assets/components/HandlePage'
import InputForm from '../assets/components/InputForm'

import '../assets/styles/Login.css'

export default function Login() {
  const [mail, setmail] = useState('')
  const [password, setPassword] = useState('')

  const auth = useAuth();
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (mail !== "" && password !== "") {
      auth.loginAction({mail, password});
      return;
    }
    alert("Entrez un mail et un mot de passe valide");
  };


  return (
    <HandelPage title='login'>
        <img src={require('../assets/images/logo.png')} className='page-login-logo'/>
        <form className='page-login-form' onSubmit={handleSubmitEvent}>
          <InputForm title='login' type='text' name='mail' placeholder='monMail@atpc.asso.fr' label='Entrez votre E-Mail :' data={mail} setData={setmail}/>
          <InputForm title='login' type='password' name='password' placeholder='monMotDePasseIci' label='Entrez votre mot de passe :' data={password} setData={setPassword}/>
          <button className='page-login-form-button'>Se connecter</button>
          <a href='/inscription' className='page-login-form-link'>Pas encore inscrit ?</a>
        </form>
    </HandelPage>
  )
}
