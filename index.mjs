import express from 'express';
import { engine as exphbs } from 'express-handlebars';
import session from 'express-session';
import pkg from 'session-file-store';
import flash from 'express-flash';
import { db } from './db/conn.mjs';
import 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
const FileStore = pkg(session);
import * as fs from 'fs';

//Set __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Import models
import { Denke } from './models/Denke.mjs';
import { User } from './models/User.mjs';


//Import routes
import { denkesRoutes } from './routes/denkeRoutes.mjs';
import { authRoutes } from './routes/authRoutes.mjs';
import { userRoutes } from './routes/UserRoutes.mjs';

//Import controller
import DenkeController from './controllers/DenkeController.mjs';
import AuthController from './controllers/AuthController.mjs';

const app = express();

// Set template engine
app.engine('handlebars', exphbs()) 
app.set("view engine", "handlebars");

// Receice responses from body as json
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set session middleware
app.use(
    session({
        name: 'session',
        secret: 'env_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function(){},
            path: path.join(os.tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// Flash messages
app.use(flash());

// Public path
app.use(express.static('public'));

// Set session to response
app.use((req, res, next) => {
    if (req.session.userid){
        res.locals.session = req.session
    };

    next();
})

//Routers

app.get('/', AuthController.login);
app.use('/denkes', denkesRoutes);
app.use('/user', userRoutes);
app.use('/', authRoutes);

db
    .sync()
    .then(() => {
        app.listen(3000)
        console.log(`Servidor em operação`);
    })
    .catch((err) => console.log(err))