var express = require("express");
var cookieParser = require("cookie-parser");

var app = express();
app.use(cookieParser());

var PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
	b2xVn2: "http://www.lighthouselabs.ca",
	"9sm5xK": "http://www.google.com"
};

const users = {
	userRandomID: {
		id: "userRandomID",
		email: "user@example.com",
		password: "purple-monkey-dinosaur"
	},
	user2RandomID: {
		id: "user2RandomID",
		email: "user2@example.com",
		password: "dishwasher-funk"
	}
};

app.post("/login", function(req, res) {
	const username = req.body.username;
	res.cookie("name", username);
	res.redirect("/urls/new");
	console.log(res.cookies);
});

app.get("/register", (req, res) => {
	let templateVars4 = {
		email: users[req.body.email],
		password: users[req.body.password]
	};
	res.render("urls_registration", templateVars4);
});

app.get("/urls/new", (req, res) => {
	let name = req.cookies.name;
	let templateVars = {
		username: name,
		longURL: urlDatabase[req.body.longURL]
	};
	res.render("urls_new", templateVars);
});

//get urls and redirect short
app.get("/u/:shortURL", (req, res) => {
	shortURL = req.params.shortURL;
	longURL = urlDatabase[shortURL];
	res.redirect(longURL);
});

app.get("/urls", (req, res) => {
	let name = req.cookies.name;
	let templateVars2 = {
		username: name,
		urls: urlDatabase
	};
	res.render("urls_index", templateVars2);
});

app.post("/register", (req, res) => {
	const clientID = generateRandomString(4);
	users[clientID] = {
		id: clientID,
		email: req.body.email,
		password: req.body.pasword
	};
	console.log(users);
	res.render("urls_registration");
});

app.post("/urls", (req, res) => {
	const shortURL = generateRandomString(6);
	urlDatabase[shortURL] = req.body.longURL;
	res.redirect("/urls");
});

app.post("/urls/:short/delete", (req, res) => {
	const short = req.params.short;
	delete urlDatabase[short];
	res.redirect("/urls");
});

app.post("/urls/:someID", (req, res) => {
	urlDatabase[req.params.someID] = req.body.longURL;
	res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
	let name = req.cookies.name;
	let templateVars3 = {
		username: name,
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL]
	};
	res.render("urls_show", templateVars3);
});

app.post("/logout", function(req, res) {
	res.clearCookie("name");
	res.redirect("/urls/new");
});

// app.get("/", (req, res) => {
// 	res.send("Hello!");

// app.get("/urls.json", (req, res) => {
// 	res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
// 	res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

function generateRandomString(length) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
