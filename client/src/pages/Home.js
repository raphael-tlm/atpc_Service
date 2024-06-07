import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Button from '../assets/components/Button';
import Link from '../assets/components/Link';
import Navigation from '../assets/components/Navigation'
import DivAdmin from '../assets/components/DivAdmin';

import '../assets/css/home.css';

export default function Home(){
    const [ connectedUsers, setConnectedUsers ] = useState(0);
    const [ isAdmin, setIsAdmin ] = useState(false);

    useEffect(() => {
        const IsAdmin = async () => {
            await fetch('http://localhost:7596/IsAdmin?token=' + localStorage.getItem('token') + '&mail=' + localStorage.getItem('mail') + '&id=' + localStorage.getItem('id') + '&statut=' + localStorage.getItem('statut') + '&prenom=' + localStorage.getItem('prenom') + '&nom=' + localStorage.getItem('nom'))
            .then(response => response.json())
            .then(data => {
                setIsAdmin(data.message);
            });
        }
        IsAdmin();   
    }, []);

    

    useEffect(() => {
        const socket = io('http://localhost:7596');
        socket.emit('login', { nom: localStorage.getItem('nom'), prenom: localStorage.getItem('prenom'), id: localStorage.getItem('id'), statut : isAdmin });
        socket.on('connectedUsers', data => {
            console.log(data);
            setConnectedUsers(data.length);
        });
        return () => {
            socket.disconnect();
        }
    }, []);


    return (
        <div className="home-page">
            <Navigation style='home' cutFrom='0'>
                {isAdmin ? null : (<img className="img-home" src={require('../assets/images/minilogo.png')}/>)}
                <Button style='home' link='/'><Link style='home' link='/'>Acceuil</Link></Button>
                <DivAdmin style='home-discussion' isAdmin={isAdmin}>
                    <Button style='home' link='/'><Link style='home' link='/'>Nouvelle Discussion</Link></Button>
                    <Button style='home' link='/'><Link style='home' link='/'>Listes Discussions</Link></Button>
                    <Button style='home' link='/'><Link style='home' link='/'>Discussions Fermée</Link></Button>
                </DivAdmin>
                <Button style='home' link='/'><Link style='home' link='/'>Mon Profil</Link></Button>
            </Navigation>
            <div className="home-content">
                <h1 className='home-title'>Bienvenue {localStorage.getItem('prenom') + ' ' +localStorage.getItem('nom')}</h1>
                
            </div> 
        </div>
    )
}