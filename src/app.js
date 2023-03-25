//* package import
const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const passportConfig = require('./passport');
require('dotenv').config();

//* Router import
const pageRouter = require('./routes/page.routes');
const apiRouter = require('./routes/api.routes');
const teamsRouter = require('./routes/teams.routes');
const usersRouter = require('./routes/users.routes');
const projectsRouter = require('./routes/projects.routes');
const adminRouter = require('./routes/admin.routes');
const chatRouter = require('./routes/chat.routes');

//* 할당
const app = express();
const PORT = 3000;

// socket.io
const webSocket = require('./socket'); // 모듈 불러오기

//* 소셜 로그인 설정
passportConfig(app);

//* 전역 설정
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

//* Nunjucks 설정
app.set('view engine', 'html');
nunjucks.configure(process.cwd() + '/src/views', { express: app, watch: true });

//* session 설정 추후 필요시 활성
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//* middleware

//* Router 설정
app.use('/', pageRouter);
app.use('/api', apiRouter);
app.use('/teams', teamsRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/admin', adminRouter);
app.use('/chat', chatRouter);

//* 서버 구동
const server = app.listen(PORT, () => {
  console.log(`✅ 서버가 연결되었습니다.`);
});

webSocket(server, app);
