const express = require('express');
const router = express.Router();

const languageWhitelist = ['english', 'french']

/* GET home page. */
router.get('/', (req, res) => {
  if (req.cookies.language && languageWhitelist.includes(req.cookies.language)) {
    res.render(req.cookies.language)
  } else {
    res.render('choose-language');
  }
});

router.get('/lang/english', (req, res) => {
  res.cookie('language', 'english');
  res.redirect('/');
});

router.get('/lang/french', (req, res) => {
  res.cookie('language', 'french');
  res.redirect('/');
});

const usersDb = [
  {
     username: 'mlaws',
     password: '123',
     admin: true
   }
 ];

 const userSessions = {
   session1: {
     loggedIn: true
   }
 }

 const findUser = username => usersDb.find(user => user.username === username)

 const validateUser = (username, password) => usersDb.find(user => user.username === username && user.password === password);

 router.get('/login', (req, res) => {

   res.render('login')
 })

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // keep in mind that the code above is the same as this:
  // const username = req.body.username
  // const password = req.body.password

  // const user = usersDb.find(user => {
  //   return user.username === username && user.password === password
  // })

  if (validateUser(username, password)) {
    res.cookie('sessionId', 'session1');
    res.redirect('/treasure');
  } else {
    res.redirect('/login');
  }
})

router.get(`/treasure`, (req, res) => {
  const sessionId  = req.cookies.sessionId;
  const user = findUser('mlaws');
  const activeSession = userSessions[sessionId]

  // if (user) {
  if (activeSession) {
    res.render('treasure', { currentUser: user });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
