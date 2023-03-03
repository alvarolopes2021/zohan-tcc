var express = require('express');
const cookieParser = require('cookie-parser');
const systemService = require('./services/systemService');

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(function (req, res, next) {
    // update to match the domain you will make the request from

    res.header("Access-Control-Allow-Origin", "https://zohan-tcc-backend.vercel.app"); 
    //res.header("Access-Control-Allow-Origin", "http://localhost:8080"); 
    
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    res.header('Access-Control-Allow-Credentials', true); 

    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");

    next();
});

systemService.onStartUp();

require('./routes/authRoutes')(app);
require('./routes/dayTimeRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/adsRoutes')(app);
require('./routes/servicesRoutes')(app);
require('./routes/ordersRoutes')(app);
require('./routes/barbersRoutes')(app);
require('./routes/barberTimeRoutes')(app);
require('./routes/revenueRoutes')(app)

app.listen(process.env.PORT || process.env.SERVER_PORT, () => {
    console.log('server on port', process.env.SERVER_PORT);
});
