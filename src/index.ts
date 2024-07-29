import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

//ejs to render HTML pages for login and profile
app.set('view engine', 'ejs');

let access_token: string = "";
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRETS;

app.get("/", (req: Request, res: Response) => {
  res.render('pages/index',{client_id: clientID});
});

//declare the callback routes
app.get('/github/callback',(req:Request, res:Response)=>{
  const requestToken = req.query.code;
  axios({
    method:'POST',
    url:`https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
      accept: 'application/json'
    }
  }).then((response)=>{
     access_token= response.data.access_token;
     res.redirect('/success');
  })
});

app.get('/success', function(req:Request, res:Response) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.render('pages/success',{ userData: response.data });
  })
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});