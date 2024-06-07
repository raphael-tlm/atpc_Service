import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Navigation from '../assets/components/Navigation'
import IsLogged from '../assets/functions/IsLogged';

import '../assets/css/home.css';

export default function Home(){
    IsLogged();

    const [ connectedUsers, setConnectedUsers ] = useState();
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ data , setData ] = useState([]);

    useEffect(() => {
        const IsAdmin = async () => {
            await fetch('http://localhost:7596/IsAdmin?token=' + localStorage.getItem('token') + '&x2=' + localStorage.getItem('x2') + '&x1=' + localStorage.getItem('x1') + '&x4=' + localStorage.getItem('x4') + '&x3=' + localStorage.getItem('x3') + '&x0=' + localStorage.getItem('x0'))
            .then(response => response.json())
            .then(data => {
                setIsAdmin(data.message);
            });
        }
        IsAdmin(); 

        // creer component
        
        const GetData = async () => {
            await fetch('http://localhost:7596/GetData?x0=' + localStorage.getItem('x0') + '&x3=' + localStorage.getItem('x3') + '&x1=' + localStorage.getItem('x1'))
            .then(response => response.json())
            .then(data => {
                setData(data);
            });
        }
        GetData();

        const socket = io('http://localhost:7596');
        socket.emit('login', { x0: localStorage.getItem('x0'), x3: localStorage.getItem('x3'), x1: localStorage.getItem('x1'), statut : isAdmin });
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
                <h1 className='home-title'>Bienvenue {data.x0} {data.x3}</h1>
                
            </div> 
        </div>
    )
}