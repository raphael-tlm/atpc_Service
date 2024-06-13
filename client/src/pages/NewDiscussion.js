import React, { useEffect, useState } from 'react'
import HandlePage from '../assets/components/HandlePage'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider'
import InputForm from '../assets/components/InputForm';
import Search from '../assets/components/SearchforMulti';

import './../assets/styles/Newdiscussion.css'

export default function Newiscussion() {
    const auth = useAuth();

    const [readOnly , setReadOnly] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [searchUser, setSearchUser] = useState('');
    const [searchTag, setSearchTag] = useState('');

    const [userAvailble, setUserAvailable] = useState([]);
    const [userSelected, setUserSelected] = useState([]);

    const [tagAvailable, setTagAvailable] = useState([]);
    const [tagSelected, setTagSelected] = useState([]);


    useEffect(() => {
        const getUser = async () => {
            const res = await fetch('http://localhost:6958/getUser?id='+auth.id);
            const data = await res.json();
            if(data.err){
                console.log(data.err);
                return;
            }
            let user = data.map((user) => {
                return {value: user.Id_Utilisateur, label: user.Nom + ' ' + user.Prenom};
            });
            setUserAvailable(user);
        }

        const getTag = async () => {
            const res = await fetch('http://localhost:6958/getTag');
            const data = await res.json();
            if(data.err){
                console.log(data.err);
                return;
            }
            let tag = data.map((tag) => {
                return {value: tag.Id_Categorie, label: tag.Label};
            });
            setTagAvailable(tag);
        }
        
        getTag();
        getUser();
    }, [auth.id]);

    const handleSubmit = async (e) => {
        
    }

    return (
        <HandlePage title="newdiscussion" nav={auth}>
            <div className='page-newdiscussion-form'>
                <InputForm title={"newdiscussion"}  type='text' name='title' placeholder='Nom de la discussion' data={title} setData={setTitle}/>
                <div className='form-newdiscussion-custom'>
                    <div className='form-newdiscussion-research'>
                        <Search title={'newdiscussion'} ph={'Rechercher un Utilisateur'} data={userAvailble} setData={setUserAvailable} search={searchUser} setSearch={setSearchUser} selected={userSelected} setSelected={setUserSelected} isMulti allowAll/>
                    </div>
                    <div className='form-newdiscussion-research'>
                        <Search title={'newdiscussion'} ph={'Rechercher un Tag'} data={tagAvailable} setData={setTagAvailable} search={searchTag} setSearch={setSearchTag} selected={tagSelected} setSelected={setTagSelected} />
                    </div>
                </div>
                <textarea className='form-newdiscussion-textarea' name='description' placeholder='Description de la discussion' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <div className='page-newdiscussion-button'>
                    {auth.isAdmin ? <button type='button' onClick={() => setReadOnly(!readOnly)}>Admin Seul</button> : null}
                    <button onClick={handleSubmit}>Créer</button>
                </div>
            </div>
            
        </HandlePage>
    )
}
