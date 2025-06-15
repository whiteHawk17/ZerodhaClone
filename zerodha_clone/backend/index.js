require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const { HoldingsModel } = require("./model/HoldingsModel");
const { OrdersModel } = require('./model/OrdersModel');
const { PositionsModel } = require('./model/PositionsModel');

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// Connect to MongoDB with options
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => {
    console.log('Successfully connected to MongoDB Atlas');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
});

// Add connection event handlers
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during MongoDB disconnection:', err);
        process.exit(1);
    }
});

// Auth routes
app.use('/auth', authRoutes);

// Protected routes
app.get('/allHoldings', auth, async (req, res) => {
    try {
        const holdings = await HoldingsModel.find();
        res.json(holdings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/orders', auth, async (req, res) => {
    try {
        const orders = await OrdersModel.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/positions', auth, async (req, res) => {
    try {
        const positions = await PositionsModel.find();
        res.json(positions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// app.get('/addHoldings',async(req,res)=>{
//     let tempHoldings=[
//         {
//           name: "BHARTIARTL",
//           qty: 2,
//           avg: 538.05,
//           price: 541.15,
//           net: "+0.58%",
//           day: "+2.99%",
//         },
//         {
//           name: "HDFCBANK",
//           qty: 2,
//           avg: 1383.4,
//           price: 1522.35,
//           net: "+10.04%",
//           day: "+0.11%",
//         },
//         {
//           name: "HINDUNILVR",
//           qty: 1,
//           avg: 2335.85,
//           price: 2417.4,
//           net: "+3.49%",
//           day: "+0.21%",
//         },
//         {
//           name: "INFY",
//           qty: 1,
//           avg: 1350.5,
//           price: 1555.45,
//           net: "+15.18%",
//           day: "-1.60%",
//           isLoss: true,
//         },
//         {
//           name: "ITC",
//           qty: 5,
//           avg: 202.0,
//           price: 207.9,
//           net: "+2.92%",
//           day: "+0.80%",
//         },
//         {
//           name: "KPITTECH",
//           qty: 5,
//           avg: 250.3,
//           price: 266.45,
//           net: "+6.45%",
//           day: "+3.54%",
//         },
//         {
//           name: "M&M",
//           qty: 2,
//           avg: 809.9,
//           price: 779.8,
//           net: "-3.72%",
//           day: "-0.01%",
//           isLoss: true,
//         },
//         {
//           name: "RELIANCE",
//           qty: 1,
//           avg: 2193.7,
//           price: 2112.4,
//           net: "-3.71%",
//           day: "+1.44%",
//         },
//         {
//           name: "SBIN",
//           qty: 4,
//           avg: 324.35,
//           price: 430.2,
//           net: "+32.63%",
//           day: "-0.34%",
//           isLoss: true,
//         },
//         {
//           name: "SGBMAY29",
//           qty: 2,
//           avg: 4727.0,
//           price: 4719.0,
//           net: "-0.17%",
//           day: "+0.15%",
//         },
//         {
//           name: "TATAPOWER",
//           qty: 5,
//           avg: 104.2,
//           price: 124.15,
//           net: "+19.15%",
//           day: "-0.24%",
//           isLoss: true,
//         },
//         {
//           name: "TCS",
//           qty: 1,
//           avg: 3041.7,
//           price: 3194.8,
//           net: "+5.03%",
//           day: "-0.25%",
//           isLoss: true,
//         },
//         {
//           name: "WIPRO",
//           qty: 4,
//           avg: 489.3,
//           price: 577.75,
//           net: "+18.08%",
//           day: "+0.32%",
//         },
//       ];

//       tempHoldings.forEach((item)=>{
//         let newholding = new HoldingsModel({
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price: item.price,
//             net: item.net,
//             day: item.day,
//         });

//         newholding.save();

//       });

//       res.send("Done!");
// });


// app.get('/addorders',async(req,res)=>{

//     let tempOrders=[
//         {
//           name: "INFY",
//           price: 1555.45,
//           percent: "-1.60%",
//           isDown: true,
//         },
//         {
//           name: "ONGC",
//           price: 116.8,
//           percent: "-0.09%",
//           isDown: true,
//         },
//         {
//           name: "TCS",
//           price: 3194.8,
//           percent: "-0.25%",
//           isDown: true,
//         },
//         {
//           name: "KPITTECH",
//           price: 266.45,
//           percent: "3.54%",
//           isDown: false,
//         },
//         {
//           name: "QUICKHEAL",
//           price: 308.55,
//           percent: "-0.15%",
//           isDown: true,
//         },
//         {
//           name: "WIPRO",
//           price: 577.75,
//           percent: "0.32%",
//           isDown: false,
//         },
//         {
//           name: "M&M",
//           price: 779.8,
//           percent: "-0.01%",
//           isDown: true,
//         },
//         {
//           name: "RELIANCE",
//           price: 2112.4,
//           percent: "1.44%",
//           isDown: false,
//         },
//         {
//           name: "HUL",
//           price: 512.4,
//           percent: "1.04%",
//           isDown: false,
//         },
//       ];

//       tempOrders.forEach((item)=>{
//         let newOrder=new OrdersModel({
//             name: item.name,
//             price: item.price,
//             percent: item.percent,
//             isDown: item.isDown,
//         })
//         newOrder.save();
//       });
//       res.send("Order Saved!");

// });

// app.get('/savePositions',async(req,res)=>{
//     let tempPositions=[
//         {
//           product: "CNC",
//           name: "EVEREADY",
//           qty: 2,
//           avg: 316.27,
//           price: 312.35,
//           net: "+0.58%",
//           day: "-1.24%",
//           isLoss: true,
//         },
//         {
//           product: "CNC",
//           name: "JUBLFOOD",
//           qty: 1,
//           avg: 3124.75,
//           price: 3082.65,
//           net: "+10.04%",
//           day: "-1.35%",
//           isLoss: true,
//         },
//       ];

//       tempPositions.forEach((item)=>{
//         let newPosition=new PositionsModel({
//             product: item.product,
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price: item.price,
//             net: item.net,
//             day: item.day,
//             isLoss: item.isLoss,
//         })
//         newPosition.save();
//       })
//       res.send("Postions saved!");
// })

app.post('/newOrder', auth, async (req, res) => {
    try {
        let idToSearch = req.body.name;
        let searchId = await HoldingsModel.findOne({ name: idToSearch, userId: req.user.userId });

        const qty = Number(req.body.qty);
        const price = Number(req.body.price);

        if (!searchId) {
            // Create new holding
            let orderHol = new HoldingsModel({
                name: idToSearch,
                qty: qty,
                avg: price,
                price: price,
                net: '+0.00%',
                day: '+0.00%',
                userId: req.user.userId
            });
            await orderHol.save();
        } else {
            // Update existing holding
            let oldQty = searchId.qty;
            let oldAvg = searchId.avg;
            let newQty = oldQty + qty;
            let newAvg = ((oldQty * oldAvg) + (qty * price)) / newQty;
            
            await HoldingsModel.updateOne(
                { name: idToSearch, userId: req.user.userId }, 
                {
                    $set: {
                        qty: newQty,
                        avg: newAvg,
                        price: price,
                        net: '+0.00%',
                        day: '+0.00%'
                    }
                }
            );
        }

        // Create new order
        let newOrder = new OrdersModel({
            name: req.body.name,
            qty: req.body.qty,
            price: req.body.price,
            mode: req.body.mode,
            userId: req.user.userId
        });
        await newOrder.save();

        // Get updated holdings for this user
        const updatedHoldings = await HoldingsModel.find({ userId: req.user.userId });
        res.json(updatedHoldings);

    } catch (error) {
        console.error("Order error:", error);
        res.status(500).send("Server error");
    }
});



app.post('/sellStock', auth, async (req, res) => {
    try {
        let uid = req.body.name;
        let quantity = req.body.qty;

        let currentStock = await HoldingsModel.findOne({ name: uid, userId: req.user.userId });
        if (!currentStock) {
            return res.status(400).send("Not found in Holding");
        }

        const actualQty = currentStock.qty;

        if (actualQty >= quantity) {
            let newOrder = new OrdersModel({
                name: req.body.name,
                qty: req.body.qty,
                price: req.body.price,
                mode: req.body.mode,
                userId: req.user.userId
            });

            if (actualQty - quantity == 0) {
                await HoldingsModel.deleteOne({ name: uid, userId: req.user.userId });
            } else {
                await HoldingsModel.updateOne(
                    { name: uid, userId: req.user.userId }, 
                    { qty: actualQty - quantity }
                );
            }

            await newOrder.save();
            res.send("Sell Success!");
        } else {
            res.status(400).send("Not enough quantity to sell in Holding");
        }
    } catch (err) {
        console.log("Sell error:", err);
        res.status(500).send("server error");
    }
});

// Place order route
app.post('/placeOrder', auth, async (req, res) => {
    try {
        const { name, price, quantity, type } = req.body;
        const order = new OrdersModel({
            name,
            price,
            quantity,
            type,
            userId: req.user.userId
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update position route
app.post('/updatePosition', auth, async (req, res) => {
    try {
        const { name, quantity, price, type } = req.body;
        let position = await PositionsModel.findOne({ name, userId: req.user.userId });
        
        if (position) {
            if (type === 'BUY') {
                position.quantity += quantity;
                position.averagePrice = ((position.averagePrice * (position.quantity - quantity)) + (price * quantity)) / position.quantity;
            } else {
                position.quantity -= quantity;
            }
        } else {
            position = new PositionsModel({
                name,
                quantity,
                averagePrice: price,
                userId: req.user.userId
            });
        }
        
        await position.save();
        res.status(201).json(position);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user specific holdings
app.get('/userHoldings', auth, async (req, res) => {
    try {
        const holdings = await HoldingsModel.find({ userId: req.user.userId });
        res.json(holdings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user specific positions
app.get('/userPositions', auth, async (req, res) => {
    try {
        const positions = await PositionsModel.find({ userId: req.user.userId });
        res.json(positions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

