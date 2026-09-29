const router = require("express").Router();
const c = require("../controllers/planController");

router.route("/").get(c.getPlans).post(c.createPlan);
router.route("/:id").get(c.getPlan).delete(c.deletePlan);

module.exports = router;