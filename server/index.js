const express = require('express');
const http = require('http');
const mysql = require('mysql');
const cors = require('cors');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());

// JWT
const secret = '6d5s4v98ds4v65ds1v984fe65v51e98r4b65f4695f4de';

// Socket.io
const server = http.createServer(app);

const io = new Server(server , {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// List of User connected (logged in the site)
let users = [];

io.on('connection', (socket) => {

    socket.on("disconnect", () => {
        if(users.length > 0 && users.find(user => user.soketId === socket.id) !== undefined){
            console.log(users.find(user => user.soketId === socket.id).name + ' ' + users.find(user => user.soketId === socket.id).firstname + ' disconnected');
        }
        users = users.filter(user => user.soketId !== socket.id);
    });

    socket.on('login', (data) => {
        users.push({id: data.id, name: data.name, firstname: data.firstname, statut : data.statut, soketId: socket.id});
        console.log(data.name + ' ' + data.firstname + ' connected');
        io.emit('users', users);
    });
    
});

// MySQL

const db = mysql.createConnection({
    host: 'localhost',
    user: 'gestion',
    password: 'gestion',
    database: 'ATPC_services'
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

app.listen(7596, () => {
    console.log('Server running on port 7596');
});