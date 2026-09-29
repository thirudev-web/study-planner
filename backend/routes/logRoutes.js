const router = require("express").Router();
const c = require("../controllers/logController");

router.post("/", c.createLog);
router.get("/:planId", c.getLogs);

module.exports = router;