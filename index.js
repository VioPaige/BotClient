const express = require('express')

const discord = require('discord.js')
const path = require('path')
const cookieParser = require('cookie-parser')
const { signedCookies } = require('cookie-parser')


const application = express()


application.set('views', path.join(__dirname, '/public'))
application.set('view engine', 'ejs')

application.use(express.static(__dirname + '/public'))
application.use(express.urlencoded({extended: true}))
application.use(express.json())
application.use(cookieParser('oau932hrWe-=#e3'))



application.get('/', (req, res) => {
    console.log("home")
    const { signedCookies, cookies } = req
    console.log(signedCookies)
    console.log(cookies)
    if (signedCookies.token) {
        res.redirect('/main')
    } else {
        res.render('index.html')
    }
})

application.get('/login', (req, res) => {
    console.log("login")
    const { query } = req
        
    const { Client, Intents, Permissions } = require('discord.js')

    const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_VOICE_STATES"], partials: ["CHANNEL"] })

    client.login(query.token).then(() => {
        res.cookie("token", `${query.token}`, {signed: true})
        res.redirect('/main')
    }).catch(() => {
        console.error
        res.send("The provided token is invalid.")
    })
})

application.get('/main', (req, res) => {
    console.log("main")
    const { signedCookies } = req
    if (signedCookies.token) {
        const { Client, Intents, Permissions } = require('discord.js')

        const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_VOICE_STATES"], partials: ["CHANNEL"] })

        client.login(signedCookies.token).then(() => {
            res.send(`Successfully logged in as ${client.user.tag}`)
        }).catch(() => {
            res.clearCookie("token")
            res.redirect('/')
        })
    }
})





const PORT = process.env.PORT || 3000
application.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})