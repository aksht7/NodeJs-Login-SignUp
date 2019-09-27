var express=require('express')
var url=require('url')
var fs=require('fs')
var session=require('express-session')
var bodyParser=require('body-parser')
var app=express()
var urlencodedParser=bodyParser.urlencoded({extended:true});
var users=[]
app.set('view engine','ejs');
function fetchUsers()
{
  fs.readFile(__dirname+'/users.txt',(err,data)=>{
      if(err)
          {
              throw err;
          }
      if(data!="")
          {
      users=JSON.parse(data);
              console.log("User refreshed");
          }
  })   
}
fetchUsers();
app.use(express.static(__dirname + '/public'));
app.use(session({'secret': 'asfsldfnaksnasdf',saveUninitialized: true,resave: true}));
app.use((req,res,next)=>{
    if(url.parse(req.url).pathname==='/login')
    next();
    else if(req.session.username!=undefined)
    next();
    else if(url.parse(req.url).pathname==='/signup')
    next();
    else if(req.session.username!=undefined)
    next();
    else
    res.send('Error');
})
app.get('/login',(req,res)=>{
    console.log(users);
    res.sendFile(__dirname+"/login.html");
})
app.post('/login',urlencodedParser,(req,res)=>{
    let user_session=0;
    console.log(users);
    console.log(req.body.username);
    console.log(req.body.password);
    for(let i=0;i<users.length;i++)
        {
            if(users[i].username==req.body.username && users[i].password==req.body.password)
                {
                    user_session=1;
                    req.session.username=req.body.username;
                    res.redirect('/home');
                    break;
                }
        }
    if(user_session==0){
        res.send("username or password didn't match");
    }
})
app.get('/home',(req,res)=>{
    res.render('home.ejs',{'username':req.session.username});
})
app.get('/signup',(req,res)=>{
    res.sendFile(__dirname+"/SignUp.html");
})
app.post('/signup',urlencodedParser,(req,res)=>{
    console.log(req.body);
    var data={
        name:req.body.name,
        username:req.body.username,
        password:req.body.password
    }
    users.push(data);
    fs.writeFile(__dirname+'/users.txt',JSON.stringify(users),function(err){
        if(err)
            throw err;
        console.log("Data Saved");
    })
    res.end("Registered");
})
app.listen(3000);