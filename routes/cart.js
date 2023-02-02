const Cart = require("../model/Cart");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAdmin } = require("./verifytoken");

const router  = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    }catch(err){
        res.status(500).json(err)
    }
});

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        const updateCart = await Cart.findByIdAndUpdate(req.params.id, 
            { $set: req.body,},
            {new:true}
        );
            res.status(200).json(updateCart);
        }catch(err){
            res.status(500).json(err)
        }
});

// // DELETE PRODUCT
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) =>{
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted successfully...")
    }catch(err){
        res.status(500).json(err)
    }
})

// GET USER CART
router.get("/find/:userId", async (req, res) =>{
    try{
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err)
    }
});

// GET ALL
router.get("/",verifyTokenAdmin ,async (req, res) =>{
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }
});


module.exports = router;