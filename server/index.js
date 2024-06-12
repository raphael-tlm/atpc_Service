const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    path: '/socket.io',
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const secret = '6d5s4v98ds4v65ds1v984fe65v51e98r4b65f4695f4de';

const openCon = () => {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'gestion',
        password: 'gestion',
        database: 'atpc_services'
    });
    con.connect((err) => {
        if (err) {
            console.log('Error connecting to Db \n'+err);
            return;
        }
        console.log('Connection established');
    });
    return con;
}

const connection = openCon();

// --------------------------------------------------------------------------------------------

function login(connection, mail, password, res)
{   

    const query = `SELECT * FROM utilisateurs WHERE Mail=?`;
    connection.query(query, [mail], (err, result) => {
        if (err) {
            res.send({err :'Erreur lors de la connexion'});
            return;
        }
        if (result.length === 0) {
            res.send({err :'E-Mail inconnu'});
            return;
        }
        if (jwt.decode(result[0].Mot_De_Passe).password !== password){
            console.log(jwt.decode(result[0].Mot_De_Passe));
            res.send({err : 'Mot de passe incorrect'});
            return;
        }
        const token = jwt.sign({mail : mail}, secret,{expiresIn: '1h'});
        res.send({data:{
            token: token,
            name : result[0].Nom,
            firstName : result[0].Prenom,
            mail : mail,
            id : result[0].Id_Utilisateur,
            isAdmin : result[0].Statut ? true : false
        }})
    });
}


app.get('/TryLogin', (req, res) => {
    const mail = req.query.mail;
    const password = req.query.password;
    login(connection, mail, password, res);
});

// --------------------------------------------------------------------------------------------

function register(connection, req, res){
    const name = req.query.name;
    const firstName = req.query.firstName;
    const mail = req.query.mail;
    const password = req.query.password;


    const query = 'SELECT * FROM utilisateurs WHERE Mail = ?';
    connection.query(query, [mail], (err, result) => {
        if(err){
            res.json({err: 'Erreur serveur'});
            return;
        }
        if(result.length > 0){
            res.json({err: 'Mail déjà utilisé'});
            return;
        }
    const query = 'INSERT INTO utilisateurs (Nom, Prenom, Mail, Mot_De_Passe) VALUES (?, ?, ?, ?)';
        connection.query(query, [name, firstName, mail, jwt.sign({password: password}, secret)], (err, result) => {
            if(err){
                res.json({err: 'Erreur serveur'});
                return;
            }
            res.json({data :{name: name, firstName: firstName, email: mail, token: jwt.sign({mail: mail}, secret), id: result.insertId, isAdmin: false}});
        });
    });
}

app.get('/TryRegister', (req, res) => {
    register(connection, req, res);
});

// --------------------------------------------------------------------------------------------

function verifToken(req , res){
    const token = req.query.token;
    const email = req.query.mail;

    jwt.verify(token, secret, (err, decoded) => {
        if(err){
            res.send({err: 'Token invalide'});
            return;
        }
        if(decoded.email !== email){
            res.send({err: 'Token invalide'});
            return;
        }
        res.send({data: decoded});
    });
}

app.get('/TryVerifToken', (req, res) => {
    verifToken(req, res);
});

// --------------------------------------------------------------------------------------------

function getInfo (connection, req, res){
    const token = req.query.token;
    const query = 'SELECT * FROM utilisateurs WHERE Mail = ?';
    jwt.verify(token, secret, (err, decoded) => {
        if(err){
            res.send({err: 'Token invalide'});
            return;
        }
        connection.query(query, [decoded.mail], (err, result) => {
            if(err){
                res.send({err: 'Erreur serveur'});
                return;
            }
            res.send({data : {name: result[0].Nom, firstName: result[0].Prenom, email: decoded.email, token: token, id: result[0].Id_Utilisateur, isAdmin: result[0].Statut ? true : false}});
        });
    });
}


app.get('/TryGetInfo', (req, res) => {
    getInfo(connection, req, res);
});

// --------------------------------------------------------------------------------------------

function getUser(connection, req, res){
    const query = 'SELECT Id_Utilisateur, Nom, Prenom FROM utilisateurs WHERE NOT Id_Utilisateur =' + req.query.id;
    connection.query(query, (err, result) => {
        if(err){
            res.send({err: 'Erreur serveur'});
            return;
        }
        res.send(result);
    });
}

app.get('/getUser', (req, res) => {
    getUser(connection, req, res);
});

// --------------------------------------------------------------------------------------------

function getTag(connection, req, res){
    const query = 'SELECT * FROM categorie';
    connection.query
    (query, (err, result) => {
        if(err){
            res.send({err: 'Erreur serveur'});
            return;
        }
        res.send(result);
    });
}

app.get('/getTag', (req, res) => {
    getTag(connection, req, res);
});

// --------------------------------------------------------------------------------------------

app.listen(6958, () => {
    console.log('Server started on http://localhost:6958');
});