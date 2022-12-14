const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const http = require('http').createServer(app)

//?- Express App Config
app.use(cookieParser())
app.use(express.json())
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

//?- Routes
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const gameRoutes = require('./api/game/game.routes')

const { setupSocketAPI } = require('./services/socket.service')
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/game', gameRoutes)
setupSocketAPI(http)

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030;
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    logger.info(`App listening on port ${port}!`)
});