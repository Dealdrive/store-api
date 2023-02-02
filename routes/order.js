const Order = require("../model/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAdmin } = require("./verifytoken");

const router  = require("express").Router();

// CREATE ORDER
router.post("/", verifyToken, async (req, res) => {
    try {
        // Create a new Order object from the request body
        const newOrder = new Order(req.body);

        // Save the new Order object to the database
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating order" });
    }
});

// UPDATE
router.put("/:id", verifyTokenAdmin, async(req, res)=>{
    try{
        const updateOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { 
                $set: req.body,
            },
            {
                new:true
            }
        );
            res.status(200).json(updateOrder);
        }catch(err){
            console.error(err);
            res.status(500).json({ message: "Error updating order" });
        }
});

// DELETE
router.delete("/:id", verifyTokenAdmin, async (req, res) =>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted successfully...")
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Error deleting order" });
    }
})

// GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) =>{
    try{
        const order = await Order.find({userId: req.params.userId});
        res.status(200).json(order);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Error getting orders" });
    }
});

// GET ALL
router.get("/",verifyTokenAdmin ,async (req, res) =>{
    try{
        const orders = await Order.find()
        res.status(200).json(orders)
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Error getting orders" });
    }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAdmin, async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth }, ...(productId && {
            products: {$elementMatch: {productId}},
        }) } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;