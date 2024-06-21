import React from 'react'

export default function Navigation({nav}) {
  function Todo() {
    return (
      <div className={'nav-group'}>
        <a href={'/nouvelle-todo'} className='bg-color-blue'>Nouveau TODO</a>
        <a href={'/liste-todo'} className='bg-color-blue'>Liste TODO</a>
        <a href={'/todogestion'} className='bg-color-blue'>Gérer TODO</a>
      </div>
    )
  }
  function Div({children}) {
    if(nav.isAdmin){
      return (
        <div className={'nav-group'}>
          {children}
        </div>
      )
    }
    return children;
  }

  return (
      <nav className={'nav'}>
          {nav.isAdmin ? null : <img src={require('../images/minilogo.png')} className={'nav-logo'}/>}
          <a href={'/'} className='bg-color-white'>Accueil</a>
          <Div>
            <a href={'/nouvelle-discussion'} className='bg-color-blue'>Nouvelle Discussion</a>
            <a href={'/liste-discussion'} className='bg-color-blue'>Liste Discussions</a>
            <a href={'/close-discussion'} className='bg-color-blue' >Discussions Fermée</a>
          </Div>
          {nav.isAdmin ? <Todo /> : null}
          <a href={'/profil'} className='bg-color-white'>Profil</a>
          <a onClick={nav.logoutAction} className='bg-color-red'>Déconnexion</a>
      </nav>

  )
}
