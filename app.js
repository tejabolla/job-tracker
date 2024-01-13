const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const session = require('express-session');
const User = require('./models/User');
const jobRoutes = require('./routes/job');
const authRoutes = require('./routes/auth');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path=require('path');
const app = express();
const crud=require('./db/crud');
const bodyParser = require('body-parser'); // Add this line
const ejs = require('ejs');

// When used, it will take index.html as default file and renders it.
app.set('view engine', 'ejs');
// app.use(express.static(process.cwd()));
app.use(express.static(path.join(__dirname,'public')));

const generateRandomKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateRandomKey(32);

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//express-sessions for maintaining sessions in a web application
app.use(session({
  secret: secretKey, // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
}));

const newUser=new crud.cred({
  userName:'mname',
  password:'mpass'
});

// Passport for authentication
app.use(passport.initialize());

/* 
// Configure passport to use JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  // Payload is the decoded JWT token
  // You can perform database queries to find and validate the user based on the payload
  // For example:
  // User.findById(payload.sub, (err, user) => {
  //   if (err) return done(err, false);
  //   if (user) return done(null, user);
  //   return done(null, false);
  // });
}));

// Set up MongoDB connection
mongoose.connect('mongodb://localhost/jobtracker', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Set up routes
app.use('/job', jobRoutes);
app.use('/', authRoutes);

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the public folder
app.use(express.static('public'));

// Catch-all route for unknown URLs
app.get('*', (req, res) => {
  res.send('Page not found');
});

*/

app.get('/',(req, res) => {
  // res.send('<h1>Welcome to Job Tracker</h1>');
  console.log('Welcome to Job Tracker');
  res.sendFile(path.resolve(process.cwd(),'public/welcome.html'))
});

app.get('/dashboard',async (req,res)=>{
  // res.sendFile(path.resolve(process.cwd(),'public/dashboard.html'))
  docs=await crudInst.findAllJobs().then((data)=>{return data});
  // console.log(docs)
  try{
    console.log('Docs are', docs[0]);
  }catch(err){
    console.log('No docs in the db');
  }
  // res.render('dashboard.ejs',{alljobs:docs});
  res.send(docs)
});
// Start the server
// connect.run('users');


const PORT = process.env.PORT || 3000;

// const newUser=new crud.cred({});

crudInst=new crud.Crud();
// crudInst.insertUser(newUser);
// crudInst.deleteUser(newUser);
app.post('/signup',async (req,res)=>{
  const uname=req.body.username;
  const pwd=req.body.password;
  newUser.userName=uname;
  newUser.password=pwd;
  // console.log('signup',uname,pwd);
  // res.send('<h1>hello</h1>')
  const credentials=await crudInst.findUser(newUser).then((usr)=>{return usr});

  // console.log('Debug: Credentials',credentials);
  if(!credentials){
    crudInst.insertUser(newUser);
    res.redirect('/dashboard');
  }
  else{
    console.log('Debug: User already exists');
    res.redirect('/');
  }

})

app.post('/signin',async (req,res)=>{
  // console.log(req.body);
  const uname=req.body.username;
  const pwd=req.body.password;
  // console.log('signin',uname,pwd);
  newUser.userName=uname;
  newUser.password=pwd;
  // console.log('new user check',newUser);
  const credentials=await crudInst.findUser(newUser).then((usr)=>{return usr});

  // console.log('Debug: Credentials',credentials);
  if(!credentials){
    console.log('Debug: User doesnot exists')
    // alert('User doesnot exists. Please signup')
    // Implement this using ejs templating. Pending for now
    // res.render('signin', { warning: 'Invalid credentials' });
    res.redirect('/');
  }
  else if(credentials.password==pwd)
  {
    console.log('Debug: Login Successfull');
    // alert('Credentials  match')
    res.send('<h1>hello</h1>')
  }
  else{
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

