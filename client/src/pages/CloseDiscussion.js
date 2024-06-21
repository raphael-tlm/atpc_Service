import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import HandlePage from '../assets/components/HandlePage'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider';
import InputForm from '../assets/components/InputForm';

import '../assets/styles/ListDiscussion.css'

export default function ListDiscussion() {
    const auth = useAuth();
    
    const [search, setSearch] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [list, setList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:6958/getallDiscussion?id='+auth.id);
            const data = await res.json();
            if(data.err){
                console.log(data.err);
                return;
            }
            setList(data.data.filter((discussion) => {return discussion.Statut == 2}).map((discussion) => {
                return {
                    Id_Discussion: discussion.Id_Discussion,
                    Title: discussion.Title,
                    Tag: discussion.Tag,
                    Auteur: discussion.Auteur,
                    Date_Ouverture: new Date(discussion.Date_Ouverture).getDate() + '/' + (new Date(discussion.Date_Ouverture).getMonth() + 1) + '/' + new Date(discussion.Date_Ouverture).getFullYear() + ' ' + new Date(discussion.Date_Ouverture).getHours() + ':' + new Date(discussion.Date_Ouverture).getMinutes()
                }
            }))
            };
        if(auth.id == null) return;
        fetchData();
    }, [auth.id])

    useEffect(() => {
        if(search === '') setSearchList(list);
        else setSearchList(list.filter((discussion) => {
            return discussion.Title.toLowerCase().includes(search.toLowerCase()) || discussion.Tag.toLowerCase().includes(search.toLowerCase()) || discussion.Statut.toLowerCase().includes(search.toLowerCase()) || discussion.Auteur.toLowerCase().includes(search.toLowerCase());
        }))
    }, [search, list])


    return (
        <HandlePage title={'list-discussion'} nav={auth}>
            <InputForm title={'list-discussion'} name={'search'} placeholder={'Rechercher une discussion'} data={search} setData={setSearch} />
            
            <div className='list-discussion-content'>
                <table className='table-discussion-list'>
                    <thead className='table-head-dl'>
                        <tr>
                            <th onClick={() => {
                                setSearchList([...searchList.sort((a, b) => {
                                    return a.Title.localeCompare(b.Title);
                                })])
                            }}>Titre</th>
                            <th onClick={() => {
                                setSearchList([...searchList.sort((a, b) => {
                                    return a.Tag.localeCompare(b.Tag);
                                })])
                            }}>Tag</th>
                                <th onClick={() => {
                                    setSearchList([...searchList.sort((a, b) => {
                                        return a.Auteur.localeCompare(b.Auteur);
                                })])
                            }}>Auteur</th>
                            <th onClick={() => {
                                setSearchList([...searchList.sort((a, b) => {
                                    return a.Date_Ouverture.localeCompare(b.Date_Ouverture);
                                })])
                            }}>Date d'ouverture</th>
                        </tr>
                    </thead>
                    <tbody className='table-body-dl'>
                    {searchList.map((discussion, index) => {                           
                            return (
                                <tr key={index} onClick={() => { navigate('/discussion', {
                                    state: {id: discussion.Id_Discussion}
                                });}}>
                                    <td>{discussion.Title}</td>
                                    <td>{discussion.Tag}</td>
                                    <td>{discussion.Auteur}</td>
                                    <td>{discussion.Date_Ouverture}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
    </HandlePage>    
  )
}
