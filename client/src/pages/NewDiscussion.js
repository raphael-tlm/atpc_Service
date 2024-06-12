import React, { useEffect, useState } from 'react'
import HandlePage from '../assets/components/HandlePage'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider'
import InputForm from '../assets/components/InputForm';
import Search from '../assets/components/Search';

export default function NewDiscussion() {
    const auth = useAuth();

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

    useEffect(() => {   
        console.log(userSelected);
    }, [userSelected]);

    const handleSubmit = async (e) => {
    }

    return (
        <HandlePage style="newdiscussion" nav={auth}>
            <form className='page-newdiscussion-form' onSubmit={handleSubmit}>
                <InputForm title={"newdiscussion"}  type='text' name='title' placeholder='Nom de la discussion' data={title} setData={setTitle}/>
                <div className='form-newdiscussion-custom'>
                    <div className='form-newdiscussion-research'>
                        <div className='form-newdiscussion-research-list'>
                            <Search title={'newdiscussion'} ph={'Recherché un Utilisateur'} data={userAvailble} setData={setUserAvailable} search={searchUser} setSearch={setSearchUser} selected={userSelected} setSelected={setUserSelected} isMulti/>
                            <Search title={'newdiscussion'} ph={'Recherché un Tag'} data={tagAvailable} setData={setTagAvailable} search={searchTag} setSearch={setSearchTag} selected={tagSelected} setSelected={setTagSelected} isMulti/>
                        </div>
                    </div>
                    <textarea className='form-newdiscussion-textarea' name='description' placeholder='Description de la discussion' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
            </form>
            
        </HandlePage>
    )
}
