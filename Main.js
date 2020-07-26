const express = require('express');
const app     = express();
const path    = require('path');
// const postgre = require('pg');
const session = require('express-session');
const PGStore = require('express-pg-session')(session);
const Router  = require('./Router');

app.use(express.static(path.join(__dirname,'build')));
app.use(express.json());

// Database 
// const { Client } = require('pg');

// const client = new Client({
//     user: 'anshul',
//     host: 'localhost',
//     database: 'nodelogin',
//     password: '1234',
//     port: 5432,
// });

// client.connect(function(err) {

//         if (err) {
//             console.log('DB error');
//             throw err;
//             return false;
//         }


//     });


// const { Client } = require('pg');
// const connectionString = 'postgres://postgres:1234@localhost:5432/logindb'

// const client = new Client ({

//     connectionString:connectionString
// });

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// client.connect(function(err) {
//     if(err){
//          console.log('DB error');
//          throw err;
//          return false ;

//     }
// });

const sessionStore = new PGStore({
    expiration: (1825*86400*1000),
    endConnectionOnClose: false ,
}, pool );

// client.query('select * from users' ,(err,res)=>{
//     console.log(err,res)
//     client.end()
// })

app.use(session({
    key:'abcd',
    secret:'12345',
    store: sessionStore,
    saveUninitialized: false,
    resave:  false,
    cookie:{
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false 
    }
}))





new  Router(app , pool );

app.get('/' , function(req,res) {
    res.sendFile(path.join(__dirname,'build','index.html'));
});

app.get('/db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM test_table');
        const results = { 'results': (result) ? result.rows : null };
        res.send(JSON.stringify(results));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})

app.listen(9000);
 