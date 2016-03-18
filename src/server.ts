﻿import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as https from 'https';

let forceSSL = require('express-force-ssl');


// Angular 2
import 'angular2-universal-preview/polyfills';

import {expressEngine, REQUEST_URL, NODE_LOCATION_PROVIDERS, NODE_HTTP_PROVIDERS} from 'angular2-universal-preview';
import {provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';

// Application
import {AppComponent} from './app/app.component';
import {DSpaceService} from './app/dspace/dspace.service';
import {HttpService} from './app/utils/http.service';
import {WebSocketService} from './app/utils/websocket.service';

// Serverside
import {TitleComponent} from './server/title.component';


enableProdMode();


var PORT = 3000;
var HOST = 'localhost';

var options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
};


let app = express();

let root = path.join(path.resolve(__dirname, '..'));

app.use(forceSSL);

// might need cors at some point
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:' + PORT);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Express View
app.engine('.html', expressEngine);
app.set('views', __dirname + '/app/view');
app.set('view engine', 'html');


function ngApp(req, res) {
    let baseUrl = '/';
    let url = req.originalUrl || '/';
    console.log('url: ' + url);
    res.render('index', {
        directives: [AppComponent, TitleComponent],
        providers: [
            provide(APP_BASE_HREF, { useValue: baseUrl }),
            provide(REQUEST_URL, { useValue: url }),
            ROUTER_PROVIDERS,
            NODE_LOCATION_PROVIDERS,
            NODE_HTTP_PROVIDERS,
            DSpaceService,
            HttpService,
            WebSocketService
        ],
        preboot: true
    });
}

app.use(express.static(root));

app.get('/**', ngApp);

https.createServer(options, app).listen(PORT, () => {
    console.log('Started');
});