import Button from './Button';
import Link from './Link';
import DivAdmin from './DivAdmin';


export default function Navigation({style, isAdmin}){
    const theStyle = (style) ? '-'+style : '';
    return (
        <nav className={'nav'+theStyle}>
            {isAdmin ? null : (<img className="img-home" src={require('../images/minilogo.png')}/>)}
            <Button style='home' ><Link style='home' to='/'>Acceuil</Link></Button>
            <DivAdmin style='home-discussion' isAdmin={isAdmin}>
                <Button style='home' ><Link style='home' to='/newdiscussion'>Nouvelle Discussion</Link></Button>
                <Button style='home'><Link style='home' to='/'>Listes Discussions</Link></Button>
                <Button style='home'><Link style='home' to='/'>Discussions Fermée</Link></Button>
            </DivAdmin>
            {isAdmin ? (
                <DivAdmin style='home-todo' isAdmin={isAdmin}>
                    <Button style='home'><Link style='home' to='/'>Nouvelle Tâche</Link></Button>
                    <Button style='home'><Link style='home' to='/'>Listes Tâches</Link></Button>
                    <Button style='home'><Link style='home' to='/'>Gerer Tâches</Link></Button>
                </DivAdmin>
            ) : null}
            <Button style='home'><Link style='home' to='/'>Mon Profil</Link></Button>
        </nav>
    )
}