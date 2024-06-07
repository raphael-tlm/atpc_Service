import Button from './Button';
import Link from './Link';
import DivAdmin from './DivAdmin';


export default function Navigation({style, isAdmin}){
    const theStyle = (style) ? '-'+style : '';
    return (
        <nav className={'nav'+theStyle}>
            {isAdmin ? null : (<img className={"img"+theStyle} src={require('../images/minilogo.png')}/>)}
            <Link style={style} to='/'><Button style={style} >Acceuil</Button></Link>
            <DivAdmin style='home-discussion' isAdmin={isAdmin}>
            <Link style={style} to='/newdiscussion'><Button style={style} >Nouvelle Discussion</Button></Link>
                <Link style={style} to='/'><Button style={style}>Listes Discussions</Button></Link>
                <Link style={style} to='/'><Button style={style}>Discussions Fermée</Button></Link>
            </DivAdmin>
            {isAdmin ? (
                <DivAdmin style='home-todo' isAdmin={isAdmin}>
                    <Link style={style} to='/'><Button style={style}>Nouvelle Tâche</Button></Link>
                    <Link style={style} to='/'><Button style={style}>Listes Tâches</Button></Link>
                    <Link style={style} to='/'><Button style={style}>Gerer Tâches</Button></Link>
                </DivAdmin>
            ) : null}
            <Link style={style} to='/'><Button style={style}>Mon Profil</Button></Link>
        </nav>
    )
}