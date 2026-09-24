const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {

  try {
    const response = await fetch(`https://www.givefood.org.uk/api/2/foodbanks/search/?address=${encodeURIComponent(req.query.postcode)}`)
    const data = await response.json()

    const charities = data.slice(0, 5).map(f => ({
      name: f.name,
      address: f.address,
      urgent_needs: f.needs?.needs || 'Any donation accepted',
      distance_miles: f.distance_m ? `${(f.distance_m / 1609).toFixed(1)} miles` : 'Unknown'
    }))
    res.json(charities)

  } catch (error) {

      res.status(501).json({ error: "Failed to fetch food bank data" });
  }


});
module.exports = router;
