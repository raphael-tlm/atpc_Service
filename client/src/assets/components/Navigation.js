import React from 'react'

export default function Navigation({nav }) {
  function X() {
    return (
      <div className={'nav-group'}>
        <a href={'/nouvelle-todo'}>Nouveau TODO</a>
        <a href={'/liste-todo'}>Liste TODO</a>
        <a href={'/todogestion'}>Gérer TODO</a>
      </div>
    )
  }

  return (
      <nav className={'nav'}>
          {nav.isAdmin ? null : <img src={require('../images/minilogo.png')} className={'nav-logo'}/>}
          <a href={'/'}>Accueil</a>
          <div className={'nav-group'}>
            <a href={'/nouvelle-discussion'}>Nouvelle Discussion</a>
            <a href={'/liste-discussion'}>Liste Discussions</a>
            <a href={'/discussion'}>Discussions Fermée</a>
          </div>
          {nav.isAdmin ? <X /> : null}
          <a href={'/profil'}>Profil</a>
          <a onClick={nav.logoutAction}>Déconnexion</a>
      </nav>

  )
}
