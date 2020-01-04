const path = require("path");
const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();

const helmet = require("helmet");
app.use(helmet());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use((req,res,next)=>{
	if(req.query.msg === 'fail'){
		res.locals.msg = "Sorry. Errors"
	}else{
		res.locals.msg =``;
	}
	next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res)=>{
	res.send("Home");
});

app.get("/welcome", (req, res, next)=>{
	res.render("welcome", {
		username: req.cookies.username
	});
});

app.param("link", (req,res,next, link)=>{
	// res.sendFile(path.join(__dirname, "public/xyz.jpg));
	res.download(path.join(__dirname, "public/xyz.jpg"), "photo.jpg");
	next();
});

app.get("/story/:storyId/:link", (req, res, next)=>{
	res.send(`Hello, ${req.params.storyId} ${req.params.link}`);
});

app.get("/login", (req, res, next)=>{
	// console.log(req.query); ///login?msg=fail&test=fail
	res.render("Login");
});

app.get("/logout", (req, res, next)=>{
	res.clearCookie('username');
	res.redirect("/login");
});

app.post("/process_login", (req,res,next)=>{
	const username =  req.body.username;
	const password =  req.body.password;
	if(password === 'x'){
		res.cookie("username", username);
		res.redirect("/welcome");
	}else{
		res.redirect("/login?msg=fail&test=fail")
	}
	// res.json(req.body);
});

app.listen(3000);
console.log("Express.js is Working... ");
