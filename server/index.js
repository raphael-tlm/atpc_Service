const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());


// --------------------------------------------------------------------------------------------

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
    try{
    const mail = req.query.mail;
    const password = req.query.password;
    login(connection, mail, password, res);
    }
    catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
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
    try{
    register(connection, req, res);
    }
    catch(e){
        console.log(e);
        res.json({err: 'Erreur serveur'});
    }
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
    try{
    verifToken(req, res);
    }
    catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }

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
                console.log(err);res.send({err: 'Erreur serveur'})
                return;
            }
            res.send({data : {name: result[0].Nom, firstName: result[0].Prenom, email: decoded.mail, token: token, id: result[0].Id_Utilisateur, isAdmin: result[0].Statut ? true : false}});
        });
    });
}


app.get('/TryGetInfo', (req, res) => {
    try{
    getInfo(connection, req, res);
    }catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
});

// --------------------------------------------------------------------------------------------

function getUser(connection, req, res){
    const query = 'SELECT Id_Utilisateur, Nom, Prenom FROM utilisateurs WHERE NOT Id_Utilisateur =' + req.query.id;
    connection.query(query, (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        res.send(result);
    });
}

app.get('/getUser', (req, res) => {
    try{
    getUser(connection, req, res);
    }
    catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
});

// --------------------------------------------------------------------------------------------

function getTag(connection, req, res){
    const query = 'SELECT * FROM categorie';
    connection.query
    (query, (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        res.send(result);
    });
}

app.get('/getTag', (req, res) => {
    try{
        getTag(connection, req, res);
    }catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
});

// --------------------------------------------------------------------------------------------

function createDiscussion(connection, req, res){
    const id = req.query.id;
    const title = req.query.title;
    const statut = req.query.statut;
    const query = `INSERT INTO discussion(Id_Utilisateur, Titre, Statut) VALUES (?, ?, ?)`;
    let id_discussion;
    connection.query(query, [id, title, statut], (err, result) => {
        if(err){
            console.log(err);
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        id_discussion = result.insertId;
        res.send({data: id_discussion});
    });

}

app.get('/createDiscussion', (req, res) => {
    try{
        createDiscussion(connection, req, res);
    }catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
});

// --------------------------------------------------------------------------------------------

app.get('/addMessage', (req, res) => {
    try {
        const id = req.query.id;
        const id_discussion = req.query.id_discussion;
        const message = req.query.message;
        const query = `INSERT INTO message(Id_Discussion, Id_Utilisateur, Contenu) VALUES (?, ?, ?)`;
        connection.query(query, [id_discussion, id, message], (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            console.log(err);
            return;
        }
        res.send({data: result.insertId});
    });
    }
    catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
});

// --------------------------------------------------------------------------------------------

function addParticipant(connection, req, res){
    const id = req.query.id;
    const id_discussion = req.query.id_discussion;
    const participants = JSON.parse(req.query.participants);
    participants.forEach((participant) => {
        const query = `INSERT INTO participant(Id_Discussion, Id_Utilisateur) VALUES (?, ?)`;
        connection.query(query, [id_discussion, participant.value], (err, result) => {
            if(err){
                console.log(err);res.send({err: 'Erreur serveur'})
                return;
            }
        });
    });
    participants.forEach((participant) => {
        const query = `SELECT Id_Message FROM message WHERE Id_Discussion = ? ORDER BY Id_Message DESC LIMIT 1`;
        connection.query(query, [id_discussion], (err, result) => {
            if(err){
                console.log(err);res.send({err: 'Erreur serveur'})
                return;
            }
            const query = `INSERT INTO derniervue(Id_Discussion, Id_Utilisateur, Id_Message) VALUES (?, ?, ?)`;
            connection.query(query, [id_discussion, participant.value, result[0].Id_Message], (err, result) => {
                if(err){
                    console.log(err);res.send({err: 'Erreur serveur'})
                    return;
                }
            });
        });
    });
    const query = `INSERT INTO participant(Id_Discussion, Id_Utilisateur) VALUES (?, ?)`;
    connection.query(query, [id_discussion, id], (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        const query = `SELECT Id_Message FROM message WHERE Id_Discussion = ? ORDER BY Id_Message DESC LIMIT 1`;
        connection.query(query, [id_discussion], (err, result) => {
            if(err){
                console.log(err);res.send({err: 'Erreur serveur'})
                return;
            }
            const query = `INSERT INTO derniervue(Id_Discussion, Id_Utilisateur, Id_Message) VALUES (?, ?, ?)`;
            connection.query(query, [id_discussion, id, result[0].Id_Message], (err, result) => {
                if(err){
                    console.log(err);res.send({err: 'Erreur serveur'})
                    return;
                }
            });
        });
    });
    res.send({data: 'Participants ajoutés'});
}

app.get('/addParticipant', (req, res) => {
    addParticipant(connection, req, res);
});


// --------------------------------------------------------------------------------------------

function addTag(connection, req, res){
    const id_discussion = req.query.id_discussion;
    const tag = req.query.tag;
    const query = `INSERT INTO categorise(Id_Discussion, Id_Categorie) VALUES (?, ?)`;
    connection.query(query, [id_discussion, tag], (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        res.send({data: 'Tag ajouté'});
    });
}

app.get('/addTag', (req, res) => {
    addTag(connection, req, res);
});

// --------------------------------------------------------------------------------------------

function getDiscussion(connection, req, res){
    let users = []
    const id = req.query.id;
    const query = `SELECT * FROM discussion WHERE Id_Discussion = ?`;
    connection.query(query, [id], (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        const query = `SELECT 
    m.Id_Message,
    m.Id_Discussion,
    m.Id_Utilisateur,
    m.Contenu,
    dv.Id_Discussion AS DernierVue_Id_Discussion,
    dv.Id_Utilisateur AS DernierVue_Id_Utilisateur,
    dv.Id_Message AS DernierVue_Id_Message
FROM 
    atpc_services.message m
LEFT JOIN 
    atpc_services.derniervue dv
ON 
    m.Id_Discussion = dv.Id_Discussion 
    AND m.Id_Message = dv.Id_Message
WHERE 
    m.Id_Discussion = ?
ORDER BY m.Id_Message ASC`;
        connection.query(query, [id], (err, messages) => {
            if(err){
                console.log(err);res.send({err: 'Erreur serveur'})
                return;
            }
            const query = `SELECT Id_Utilisateur FROM utilisateurs`;
            connection.query(query, [id], (err, participants) => {
                if(err){
                    console.log(err);res.send({err: 'Erreur serveur'})
                    return;
                }
                participants.forEach((participant, key) => {
                    const query = `SELECT Id_Utilisateur, Nom, Prenom FROM utilisateurs WHERE Id_Utilisateur = ?`;
                    connection.query(query, [participant.Id_Utilisateur], (err, user) => {
                        if(err){
                            console.log(err);res.send({err: 'Erreur serveur'})
                            return;
                        }
                        users.push(user[0]);
                        if(key+1 === participants.length){
                            res.send({data: {Title: result[0].Titre, Statut: result[0].Statut, Messages: JSON.stringify(messages), Participants: JSON.stringify(participants), User: JSON.stringify(users)}});
                        }
                    });
                });
            });
        });
    });
}

app.get('/getDiscussion', (req, res) => {
    getDiscussion(connection, req, res);
});

// --------------------------------------------------------------------------------------------

function addMessage(connection, req, res){
    const id = req.query.id;
    const id_discussion = req.query.id_discussion;
    const message = req.query.content;
    const query = `INSERT INTO message(Id_Discussion, Id_Utilisateur, Contenu) VALUES (?, ?, ?)`;
    connection.query(query, [id_discussion, id, message], (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        res.send({data: result.insertId});
    });
}

app.get('/addMessage', (req, res) => {
    addMessage(connection, req, res);
});


// --------------------------------------------------------------------------------------------
function getAllDiscussion(connection, req, res){
    const infodiscussions = [];
        const query = `SELECT * FROM discussion`;
        connection.query(query, (err, result) => {
            if(err){
                console.log(err);res.send({err: 'Erreur serveur'})
                return;
            }
            result.forEach((discussion) => {
                const query = `SELECT Nom, Prenom FROM utilisateurs WHERE Id_Utilisateur = ?`;
                connection.query(query, [discussion.Id_Utilisateur], (err, user) => {
                    if(err){
                        console.log(err);res.send({err: 'Erreur serveur'})
                        return;
                    }
                    const query = `SELECT Id_Categorie FROM categorise WHERE Id_Discussion = ?`;
                    connection.query(query, [discussion.Id_Discussion], (err, cat) => {
                        if(err){
                            console.log(err);res.send({err: 'Erreur serveur'})
                            return;
                        }
                        const query = `SELECT Label FROM categorie WHERE Id_Categorie = ?`;
                        connection.query(query, [cat[0].Id_Categorie], (err, tag) => {
                            if(err){
                                console.log(err);res.send({err: 'Erreur serveur'})
                                return;
                            }
                            const data = {
                                Id_Discussion: discussion.Id_Discussion,
                                Title: discussion.Titre,
                                Statut: discussion.Statut,
                                lStatut: discussion.Statut == 1 ? 'Ouvert' : discussion.Statut == 2 ? 'Fermé' : 'Lecture seule',
                                Tag: tag[0].Label,
                                Auteur: user[0].Nom + ' ' + user[0].Prenom,
                                Date_Ouverture: new Date(discussion.Date).getTime()
                            }
                            infodiscussions.push(data);
                            if(result.length === infodiscussions.length) res.send({data: infodiscussions});
                        });
                    });
                });
            });
        });
}

function getPersoDiscussion(connection, req, res){
    const iddiscussions = [];
    const infodiscussions = [];
    const id = req.query.id;
    const query = `SELECT Id_Discussion FROM participant WHERE Id_Utilisateur = ?`;
        connection.query(query, [id], (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        result.forEach((discussion) => {
            iddiscussions.push(discussion.Id_Discussion);
        });
        const query = `SELECT * FROM discussion WHERE Id_Discussion IN (?)`;
        if(iddiscussions.length === 0) res.send({data: []});
        iddiscussions.forEach(discussion => {
            connection.query(query, [discussion], (err, result) => {
                if(err){
                    console.log(err);res.send({err: 'Erreur serveur'})
                    return;
                }
                const query = `SELECT Nom, Prenom FROM utilisateurs WHERE Id_Utilisateur = ?`;
                connection.query(query, [result[0].Id_Utilisateur], (err, user) => {
                    if(err){
                        console.log(err);res.send({err: 'Erreur serveur'})
                        return;
                    }
                    const query = `SELECT Id_Categorie FROM categorise WHERE Id_Discussion = ?`;
                    connection.query(query, [discussion], (err, cat) => {
                        if(err){
                            console.log(err);res.send({err: 'Erreur serveur'})
                            return;
                        }
                        const query = `SELECT Label FROM categorie WHERE Id_Categorie = ?`;
                        connection.query(query, [cat[0].Id_Categorie], (err, tag) => {
                            if(err){
                                console.log(err);res.send({err: 'Erreur serveur'})
                                return;
                            }
                            const data = {
                                Id_Discussion: result[0].Id_Discussion,
                                Title: result[0].Titre,
                                Statut: result[0].Statut,
                                lStatut: result[0].Statut == 1 ? 'Ouvert' : result[0].Statut == 2 ? 'Fermé' : 'Lecture seule',
                                Tag: tag[0].Label,
                                Auteur: user[0].Nom + ' ' + user[0].Prenom,
                                Date_Ouverture: new Date(result[0].Date).getTime()
                            }
                            infodiscussions.push(data);
                            if(iddiscussions.length === infodiscussions.length) res.send({data: infodiscussions});
                        });
                    });
                });
            });
        });
    });
}


app.get('/getallDiscussion', (req, res) => {
    try{
        if(req.query.isAdmin === 'true') getAllDiscussion(connection, req, res);
        else getPersoDiscussion(connection, req, res);
    }catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
});

// --------------------------------------------------------------------------------------------

function updateLastRead(connection, req, res){
    const id = req.query.id;
    const id_discussion = req.query.id_discussion;
    const query = `SELECT Id_Message FROM message WHERE Id_Discussion = ? ORDER BY Id_Message DESC LIMIT 1`;
    connection.query(query, [id_discussion], (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        const query = `UPDATE derniervue SET Id_Message = ? WHERE Id_Discussion = ? AND Id_Utilisateur = ?`;
        connection.query(query, [result[0].Id_Message, id_discussion, id], (err, result) => {
            if(err){
                console.log(err);res.send({err: 'Erreur serveur'})
                return;
            }
            res.send({data: 'Dernier message lu'});
        });
    });
}


app.get('/updateLastRead', (req, res) => {
    try{
        updateLastRead(connection, req, res);
    }
    catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
});


// --------------------------------------------------------------------------------------------

function update(connection, req, res){
    const id = req.query.id;
    const data = req.query.data;
    const label = req.query.label;
    const query = `UPDATE utilisateurs SET ${label} = ? WHERE Id_Utilisateur = ?`;
    connection.query(query, [data, id], (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        res.send({data: data});
    });
}

app.get('/update', (req, res) => {
    try{
        update(connection, req, res);
    }
    catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
});

// --------------------------------------------------------------------------------------------

function updatePass(connection, req, res){
    const id = req.query.id;
    const data = req.query.data;
    const query = `UPDATE utilisateurs SET Mot_De_Passe = ? WHERE Id_Utilisateur = ?`;
    connection.query(query, [jwt.sign({password: data}, secret), id], (err, result) => {
        if(err){
            console.log(err);res.send({err: 'Erreur serveur'})
            return;
        }
        res.send({data: "Correctement modifié"});
    });
}

app.get('/updatePass', (req, res) => {
    try{
        updatePass(connection, req, res);
    }
    catch(e){
        console.log(e);
        console.log(err);res.send({err: 'Erreur serveur'})
    }
});

// --------------------------------------------------------------------------------------------

const server = http.createServer(app);
const io = new Server(server, {
    path: '/socket.io',
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    socket.on('newMessage', (data) => {
        socket.broadcast.emit('newMessage', data);
    });
}
);

server.listen(6958, () => {
    console.log('Server started on http://localhost:6958');
});
