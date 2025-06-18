import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from "express";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from "cors";
import authRoutes from './routes/auth.js';
import auth from './middleware/auth.js';
import { HoldingsModel } from "./model/HoldingsModel.js";
import { OrdersModel } from './model/OrdersModel.js';
import { PositionsModel } from './model/PositionsModel.js';


// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config({ path: join(__dirname, '.env') });

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URI;

console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

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

//
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
    console.log(`Server is running on: ${PORT}`);
});

