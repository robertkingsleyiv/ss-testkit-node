let express = require ('express')
let app = express()
let cors = require('cors')
let axios = require ('axios')
let bodyParser = require('body-parser')
let $SM_KEY = "e26BGpAseLRsnrB0jg01ZnSyZFeLNq8b8ruymhZvR5xe9zYRxKnUVJsd6f5p"
let data = []
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
let getSportmonksData = () => {
    // Retrieve
    axios.get(`https://soccer.sportmonks.com/api/v2.0/livescores/now?api_token=${$SM_KEY}&include=localTeam,visitorTeam,stats,flatOdds,league,inplayOdds&bookmakers=2&markets=1`).then(resp => {
    // Set 
    let beforeParsing = resp.data.data
    beforeParsing.forEach(match => {
        match.supremacy = {
            localTeam: null,
            visitorTeam: null
        }
        if(match.stats.data[0] && match.stats.data[1] && match.stats.data[0].attacks && match.stats.data[0].shots){
            let match_supremacy = Number(match.stats.data[0].attacks.dangerous_attacks) + (Number(match.stats.data[0].shots.ongoal) * 10) + Number(match.stats.data[1].attacks.dangerous_attacks) + (Number(match.stats.data[1].shots.ongoal) * 10)
            match.supremacy.localTeam = (Number(match.stats.data[0].attacks.dangerous_attacks)  + (Number(match.stats.data[0].shots.ongoal) * 10)) / Number(match_supremacy) * 100
            match.supremacy.visitorTeam = (Number(match.stats.data[1].attacks.dangerous_attacks) + (Number(match.stats.data[1].shots.ongoal) * 10)) / Number(match_supremacy) * 100
      
        }
  })
    data = beforeParsing.filter(match => match.time.status === 'LIVE')
    })
    // Log
    console.log("Data Updated...")
    // Loop
    setTimeout(getSportmonksData, 10000)
}
getSportmonksData()
app.get('/data', (req,res)=>{
    res.send(data)
})
app.listen(9299, () => {
    console.log(`Server started on port :9299 👍`);
});