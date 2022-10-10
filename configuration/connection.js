// Import the mongoose module
const mongoose = require('mongoose');

// Set up default mongoose connection
const mongoDB ="mongodb+srv://shopping-cart-admin:admin123@shopping-cart.gthbzab.mongodb.net/shopping-cart?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology:true})
.then( () => console.log("connection successful at the db"))
.catch((error) => console.log(error));

// mongodb+srv://shopping-cart-admin:admin123@shopping-cart.gthbzab.mongodb.net/?retryWrites=true&w=majority
