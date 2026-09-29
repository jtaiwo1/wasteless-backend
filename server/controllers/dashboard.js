const { getAnalytics } = require("../services/insightsClient")


async function index(req,res) {
    try {
        const user_id = req.user.user_id

        const analytics = await getAnalytics(user_id)
        res.status(200).json(analytics)
    } catch (err) {
        res.status(500).send({error: "No users found"})
    }
    
}

module.exports = { index }