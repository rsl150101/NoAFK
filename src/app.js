//* package import
const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

//* Router import
const pageRouter = require('./routes/page.routes');
const apiRouter = require('./routes/api.routes');
const teamsRouter = require('./routes/teams.routes');
const usersRouter = require('./routes/users.routes');

//* 할당
const app = express();
const PORT = 3000;

//* 전역 설정
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

//* Nunjucks 설정
app.set('view engine', 'html');
nunjucks.configure(process.cwd() + '/src/views', { express: app, watch: true });

// //* session 설정 추후 필요시 활성
// app.use(
//   session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

//* middleware

//* Router 설정
app.use('/', pageRouter);
app.use('/api', apiRouter);
app.use('/teams', teamsRouter);
app.use('/users', usersRouter);

//* 서버 구동
app.listen(PORT, () => {
  console.log(`✅ 서버가 연결되었습니다. http://localhost:${PORT}`);
});
