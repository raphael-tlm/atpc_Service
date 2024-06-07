
export default function IsLogged(){
    if(localStorage.getItem('token') && localStorage.getItem('x2') && localStorage.getItem('x1') && localStorage.getItem('x4') && localStorage.getItem('x3') && localStorage.getItem('x0')){
        return;
    }
    else{
        window.location.href = '/login';
    }
}