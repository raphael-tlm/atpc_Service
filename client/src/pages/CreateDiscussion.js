import { useEffect, useState } from "react";

import Navigation from "../assets/components/Navigation"
import Button from "../assets/components/Button"
import InputTitle from "../assets/components/InputTitle"
import InputMessage from "../assets/components/InputMessage";
import IsLogged from "../assets/functions/IsLogged";
import Selection from "../assets/components/Selection";
import Search from "../assets/components/Search";

import '../assets/css/create-discussion.css'

export default function CreateDiscussion(){

    IsLogged();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [flair, setFlair] = useState();
    const [user, setUser] = useState();

    const [selectedFlair, setSelectedFlair] = useState([]);
    const [selecteduser , setSelectedUser] = useState([]);

    useEffect(() => {
        const GetInfo = async () => {
            await fetch('http://localhost:7596/GetFlair')
            .then(response => response.json())
            .then(data => {
                setFlair(data);
            });
            await fetch('http://localhost:7596/GetUser')
            .then(response => response.json())
            .then(data => {
                setUser(data);
            });
        }

        GetInfo();
    }, []);

    return (
        <div className="create-discussion-page">
            <Navigation style='create-discussion'/>
            <div className="create-discussion-content">
                <InputTitle style='create-discussion' title='Titre de la discussion' content={title} handleChange={(e) => setTitle(e.target.value)}/>
                <div>
                    <Selection style='create-discussion' title='Catégorie' titleSelected='Catégorie Utilisé' data={flair} setData={setFlair} selected={selectedFlair} setSelected={setSelectedFlair}/>
                    <Search style='create-discussion' placeholder='Rechercher un utilisateur' data={user} setData={setUser} selected={selecteduser} setSelected={setSelectedUser} />
                </div>
                <InputMessage style='create-discussion' content={content} handleChange={(e) => setContent(e.target.value)} placeholder='Contenu de la discussion'/>
            </div>
        </div>
    )
}