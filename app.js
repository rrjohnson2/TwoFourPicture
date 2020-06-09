
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')
const cookieParser = require('cookie-parser');
const cors = require('cors');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


var twofour_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/content')
    },
    filename: (req, file, cb) => {
        if(path.extname(file.originalname)==".mp3"||
          path.extname(file.originalname)==".png" ||
          path.extname(file.originalname)==".jpg" ||
          path.extname(file.originalname)==".mp4" ||
          true
          ){
            cb(null,file.originalname)}
        else
           { 
               cb(new Error('Only audio video and images are allowed'));
            }
    }
});

//will be using this for uplading
const twofour_content = multer({ storage: twofour_storage }).single('sub');



app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });

app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));




app.get('/getSubmission', function(req,res) {
    var sub = req.param("sub");
    res.sendFile(path.join(`${__dirname}/public/content/${sub}`));
})

app.post('/uploadSubmission', function(req,res) {
    twofour_content(req,res,(err)=> {
        res.send(err)});
})
module.exports = app;