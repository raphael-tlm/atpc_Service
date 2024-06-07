const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

// JWT
const secret = '6d5s4v98ds4v65ds1v984fe65v51e98r4b65f4695f4de';

// Socket.io

const io = new Server(server, {
    path: '/socket.io',
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let connectedUsers = [];

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user.socketId !== socket.id);
        io.emit('connectedUsers', connectedUsers);
    });

    socket.on('login', (data) => {
        const user = {
            x0: data.x0,
            x3: data.x3,
            x1 : data.x1,
            x4: data.x4,
            socketId: socket.id
        }
        if(connectedUsers.find(user => user.x1 === data.x1)){
            connectedUsers = connectedUsers.filter(user => user.x1 !== data.x1);
        }
        connectedUsers.push(user);
        io.emit('connectedUsers', connectedUsers);
    });
});

// MySQL

const db = mysql.createConnection({
    host: 'localhost',
    user: 'gestion',
    password: 'gestion',
    database: 'atpc_services'
});


db.connect((err) => {
    if(err){
        console.log('Error connecting to database : ', err);
    } else {
        console.log('Connected to database');
    }
});

// Querry

app.get('/TryLogin', (req, res) => {
    const mail = req.query.mail;
    const password = jwt.sign(req.query.password, secret);
    const sql = 'SELECT * FROM utilisateurs WHERE Mail = ? ';
    db.query(sql, [mail], (err, result) => {
        if(err){
            res.send({err: err});
        }
        if(result.length > 0){
            if(result[0].Mot_De_Passe === password){
                const token = jwt.sign({mail: mail}, secret, { expiresIn: 60 * 35 });
                res.send({token: token, x0 : jwt.sign(result[0].Nom, secret), x3 : jwt.sign(result[0].Prenom, secret), x2 : jwt.sign(mail, secret), x1 : jwt.sign(result[0].Id_Utilisateur, secret),x4 : jwt.sign(result[0].Statut,result[0].prenom+result[0].nom+result[0].mail+result[0]+token+secret)});
            }
            else{
                res.send({err: 'Mot de passe incorrect'});
            }
        } else {
            res.send({err: 'Utilisateur non trouvé'});
        }
    });
});

app.get('/TryRegister', (req, res) => {

    const mail = req.query.mail;
    const password = jwt.sign(req.query.password, secret);
    const prenom = req.query.prenom;
    const nom = req.query.nom;
    const sql = 'INSERT INTO utilisateurs (Nom, Prenom, Mail, Mot_De_Passe) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom , prenom, mail, password], (err, result) => {
        if(err){
            res.send({err: err});
        }
        else{
            res.send({token: jwt.sign({mail: mail}, secret, { expiresIn: 60 * 35 }), x1 : jwt.sign(result.insertId, secret), x0 : jwt.sign(nom, secret), x3 : jwt.sign(prenom, secret), x2 : jwt.sign(mail, secret), x4 : jwt.sign(0, prenom+nom+mail+result.insertId+secret)});
        }
    });
});

app.get('/isAdmin', (req, res) => {
    const token = req.query.token;
    const statut = req.query.x4;
    const prenom = req.query.x3;
    const nom = req.query.x0;
    const mail = req.query.x2;
    const id = req.query.x1;
    const isAdmin = jwt.decode(statut, prenom+nom+mail+id+token+secret);
    if(isAdmin === '1'){
        res.send({message: true});
    } else {
        res.send({message: false});
    }
});

app.get('/getData', (req, res) => {
    const nom = req.query.x0;
    const prenom = req.query.x3;
    const id = req.query.x1;
    res.send({id: jwt.decode(nom, secret), n: jwt.decode(prenom, secret), c : jwt.decode(id, secret)});
});    

app.get('/getFlair', (req, res) => {
    let data = [];
    const sql = 'SELECT * FROM categorie';
    db.query(sql, (err, result) => {
        if(err){
            res.send({err: err});
        }
        for(let i = 0; i < result.length; i++){
            data.push({id : result[i].Id_Categorie, n: result[i].Label, c: result[i].Importance});
        }
        res.send(data);
    });

});

app.get('/getUser', (req, res) => {
    let data = [];
    const sql = 'SELECT Id_Utilisateur, Nom, Prenom, Statut FROM utilisateurs';
    db.query(sql, (err, result) => {
        if(err){
            res.send({err: err});
        }
        for(let i = 0; i < result.length; i++){
            data.push({id : result[i].Id_Utilisateur, n: result[i].Prenom + ' ' + result[i].Nom, c: result[i].Statut});
        }
        res.send(data);
    });
});

server.listen(7596, () => {
    console.log('Server running on port 7596');
});