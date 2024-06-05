import { useState, useEffect } from 'react';

import Button from '../assets/components/Button';
import Link from '../assets/components/Link';
import Navigation from '../assets/components/Navigation';

import '../assets/css/home.css';

export default function Home(){
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

    return (
        <div className="home-page">
            <Navigation style='home' cutFrom='0'>
                <img className="img-home" src={require('../assets/images/minilogo.png')}/>
                <Button style='home' link='/'><Link style='home' link='/'>Acceuil</Link></Button>
                { isAdmin ? null : (<Button style='home' link='/'><Link style='home' link='/'>Nouvelle Discussion</Link></Button>) }
                <Button style='home' link='/'><Link style='home' link='/'>Listes Discussions</Link></Button>
                <Button style='home' link='/'><Link style='home' link='/'>Discussions Fermée</Link></Button>
            </Navigation>
            <div className="home-content">
                <div className="home-content-title">
                    <h1>Bienvenue {localStorage.getItem('prenom') + ' ' +localStorage.getItem('nom')}</h1>
                </div>
            </div> 
        </div>
    )
}