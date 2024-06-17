import React, { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider'
import HandlePage from '../assets/components/HandlePage';
import InputForm from '../assets/components/InputForm';
import MessageList from '../assets/components/MessageList';

export default function Discussion() {
  const location = useLocation()
  if(!location.state)  window.location.href = '/';
  const auth = useAuth();

  const [title, setTitle] = useState();
  const [state, setState] = useState();
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(()=>{
    const fetchData = async () => {
      const res = await fetch('http://localhost:6958/getDiscussion?id='+location.state.id);
      const data = await res.json();
      if(data.err){
        console.log(data.err);
        window.location.href = '/'
        return;
      }
      setTitle(data.data.Title);
      setState(data.data.Statut);
      setParticipants(JSON.parse(data.data.Participants));
      setMessages(JSON.parse(data.data.Messages));
    }
    fetchData();
  }, [])
  useEffect(()=>{
    let isInclude = false;
    if(participants.length === 0) return;
    else {
      participants.forEach((participant) => {
        if(participant.Id_Utilisateur === auth.id){
          isInclude = true;
        }
      });
      if(!isInclude) window.location.href = '/';
    }
  }, [participants])

  const handleSubmit = async () => {
    if(message === '') return;
    const res = await fetch('http://localhost:6958/addMessage?message='+message+'&id_discussion='+location.state.id+'&id='+auth.id);
    const data = await res.json();
    if(data.err){
      console.log(data.err);
      return;
    }
    setMessages([...messages, {Id_Utilisateur: auth.id, Contenu: message}]);
    setMessage('');
  }

  return (
    <HandlePage title="discussion" nav={auth}>
      <div className='page-discussion-content'>
        <h1>{title}</h1>
        <div className='page-discussion-content-message'>
          <MessageList data = {messages} id={auth.id}/>
        </div>
        { state === 1 ? <><InputForm title='discussion' placeholder='Message' data={message} setData={setMessage} onChange={setMessage} />
        <button onClick={handleSubmit}>Envoyer</button></> : null}
      </div>
    </HandlePage>
  )
}
