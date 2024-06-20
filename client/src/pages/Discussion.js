import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../assets/components/custom/hooks/AuthProvider'
import HandlePage from '../assets/components/HandlePage';
import InputForm from '../assets/components/InputForm';
import MessageList from '../assets/components/MessageList';

import '../assets/styles/Discussion.css'

import io from 'socket.io-client';
const socket = io('http://localhost:6958');

export default function Discussion() {
  const location = useLocation()
  if(!location.state)  window.location.href = '/';
  const auth = useAuth();

  const [title, setTitle] = useState();
  const [state, setState] = useState();
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [user, setUser] = useState();
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
      setUser(JSON.parse(data.data.User));
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

    socket.emit('newMessage', {id: auth.id, message: message, id_discussion: location.state.id});

    scrollToBottom();
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(()=>{
    socket.on('newMessage', (data) => {
      if(data.id_discussion === location.state.id){
        setMessages([...messages, {Id_Utilisateur: data.id, Contenu: data.message}]);
        scrollToBottom();
      }
    })
  },[messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messagesEndRef = useRef(null);
  return (
    <HandlePage title="discussion" nav={auth}>
        <div><a href='/liste-discussion'>{"<"}</a><h1>{title}</h1></div>
        <div className='page-discussion-content-message'>
          <MessageList data={messages} users={user} id={auth.id} refpointer={messagesEndRef}/>
        </div>
        { state === 1 ? <><InputForm title='discussion' placeholder='Message' data={message} setData={setMessage} onChange={setMessage} />
        <button onClick={handleSubmit}>Envoyer</button></> : null}
    </HandlePage>
  )
}
