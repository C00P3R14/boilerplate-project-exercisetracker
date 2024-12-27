const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:false}))

//data

const users = [];
const userExercises = []

app.get('/', (req, res) => {
  console.log(`test ${4 <= 3 && 4 >= 1}`)
  res.sendFile(__dirname + '/views/index.html')
});

//request on /api/users endpoint
app.route('/api/users/:_id?')
.post((req,res,next) => {
req.params._id = Math.floor(Math.random() * 1000).toString()

const postUser = {
  _id: req.params._id,
  username: req.body.username
}

users.push(postUser)

res.json(postUser)
})
.get(
  (req,res,next) => {
    res.json(users)
  }
)

// exercise endpoint
app.route('/api/users/:_id/exercises').post(
  (req,res,next) => {
    const user = users.find(user => user._id === req.params._id);
    if(!user) res.json({error: `user with id ${req.params._id} cannot be found`})
      const userExercise = {...user}
    userExercise['description'] = req.body.description;
    userExercise['duration'] = Number(req.body.duration);
    userExercise['date'] = !req.body.date ? new Date().toDateString() : new Date(req.body.date).toDateString();

    userExercises.push(userExercise)

    res.json(userExercise);
    res.end()

  }
)

//logs endpoint
app.get('/api/users/:_id/logs?', (req,res,next) => {
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit
  const fromDate = Date.parse(new Date(from)) - 7200000;
  const toDate = Date.parse(new Date(to)) - 7200000;
  const limitNumber = Number.isNaN(Number(limit)) ? 0 : Number(limit);
  const user = users.find(user => user._id === req.params._id);
  

  if(!user) res.json({error: `user with id ${req.params._id} cannot be found`});

  if (!from && !to) 
  {
    const userLog = {...user};
  userLog.log = userExercises.filter(userE => userE._id === user._id ).map((usr) => {
    return {description: usr.description, duration: usr.duration, date: usr.date}
  })
  userLog.count = userLog.log.length;

  res.json(userLog);
  //next()
  } else {
    const userLog = {...user};
    console.log(`from : ${fromDate} to: ${toDate} limit: ${limitNumber}`)
  userLog.log = userExercises.filter(userE => userE._id === user._id ).map((usr) => {
    return {description: usr.description, duration: usr.duration, date: usr.date}
  }).filter((user) => {
    const userDate = Date.parse(user.date)

    console.log(`for: ${user.description} userDate: ${userDate} testResult: ${userDate >= fromDate || userDate <= toDate}`)
    console.log(fromDate - userDate)

    return userDate >= fromDate && userDate <= toDate
  }).slice(0,limitNumber)
  userLog.count = userLog.log.length;

  res.json(userLog);
  }
  

})

/*app.get('/api/users/:_id/logs?[from][&to][&limit]',
  (req,res) => {
    const {from,to,limit} = req.query;
    const fromDate = new Date(from).getMilliseconds();
    const toDate = new Date(to).getMilliseconds();
    const limitNumber = Number.isNaN(Number(limit)) ? 0 : Number(limit);
    if(!fromDate && !toDate) res.json({error: `request invalid fromDate: ${fromDate} to: ${toDate} `})
      //const filteredLog = {...req.body.log};
    
    if(fromDate && toDate) userLog.log = userLog.log.filter(user => Date.parse(user.date) <= toDate && Date.parse(user.date) >= fromDate).slice(0,limitNumber)
      res.send(`FromDate: ${from}, toDate: ${to},limit: ${limit}`)
  
      console.log(`FromDate: ${from}, toDate: ${to},limit: ${limit}`)
    
  }
)

/**
 * app.get('/api/users/:_id/logs/:from?.:to?.:limit?', (req,res) => {
  const user = users.find(user => user._id === req.params._id);
  if(!user) res.json({error: `user with id ${req.params._id} cannot be found`});
  const userLog = {...user};
  userLog.log = userExercises.filter(userE => userE._id === user._id ).map((usr) => {
    return {description: usr.description, duration: usr.duration, date: usr.date}
  })
  userLog.count = userLog.log.length;
  const {from,to,limit} = req.params;

  const fromDate = new Date(from).getMilliseconds();
  const toDate = new Date(to).getMilliseconds();
  const limitNumber = Number.isNaN(Number(limit)) ? 0 : Number(limit);

  if(fromDate && toDate) userLog.log.filter(user => Date.parse(user.date) <= toDate && Date.parse(user.date) >= fromDate).slice(0,limitNumber)

  console.log(`FromDate: ${from}, toDate: ${to},limit: ${limit}`)



  res.json(userLog)






})

 */



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
