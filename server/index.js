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
        origin: 'http://localhost:3000',
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
            nom: data.nom,
            prenom: data.prenom,
            id: data.id,
            statut: data.statut,
            socketId: socket.id
        }
        if(connectedUsers.find(user => user.id === data.id)){
            connectedUsers = connectedUsers.filter(user => user.id !== data.id);
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
    database: 'service_atpc'
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
                res.send({token: token, nom : result[0].Nom, prenom : result[0].Prenom, mail : result[0].Mail, id : result[0].Id_Utilisateur, statut : jwt.sign(result[0].Statut,result[0].prenom+result[0].nom+result[0].mail+result[0]+token+secret)});
            }
            else{
                res.send({message: 'Mot de passe incorrect'});
            }
        } else {
            res.send({message: 'Utilisateur non trouvé'});
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
        res.send({token: jwt.sign({mail: mail}, secret, { expiresIn: 60 * 35 }), id : result.insertId, statut : jwt.sign(0, prenom+nom+mail+result.insertId+secret)});
    });
});

app.get('/isAdmin', (req, res) => {
    const token = req.query.token;
    const statut = req.query.statut;
    const prenom = req.query.prenom;
    const nom = req.query.nom;
    const mail = req.query.mail;
    const id = req.query.id;
    const isAdmin = jwt.decode(statut, prenom+nom+mail+id+token+secret);
    if(isAdmin === '1'){
        res.send({message: true});
    } else {
        res.send({message: false});
    }
});

server.listen(7596, () => {
    console.log('Server running on port 7596');
});