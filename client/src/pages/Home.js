import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Button from '../assets/components/Button';
import Link from '../assets/components/Link';
import Navigation from '../assets/components/Navigation'
import DivAdmin from '../assets/components/DivAdmin';
import IsLogged from '../assets/functions/IsLogged';

import '../assets/css/home.css';

export default function Home(){
    IsLogged();

    const [ connectedUsers, setConnectedUsers ] = useState();
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
            setConnectedUsers(data);
        });
        return () => {
            socket.disconnect();
        }
    }, []);


    return (
        <div className="home-page">
            <Navigation style='home' isAdmin={isAdmin}/>
            <div className="home-content">
                <h1 className='home-title'>Bienvenue {localStorage.getItem('prenom') + ' ' +localStorage.getItem('nom')}</h1>
                
            </div> 
        </div>
    )
}