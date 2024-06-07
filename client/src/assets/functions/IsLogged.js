
export default function IsLogged(){
    if(localStorage.getItem('token') && localStorage.getItem('mail') && localStorage.getItem('id') && localStorage.getItem('statut') && localStorage.getItem('prenom') && localStorage.getItem('nom')){
        return;
    }
    else{
        window.location.href = '/login';
    }
}