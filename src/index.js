import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/connectDB.js';
dotenv.config();


const port = process.env.PORT || 3000;

//Server starts only after DB connects. This avoids half-broken apps.
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on the port http://localhost:${port}....`);
  });
}).catch((error) => console.log("Server Startup Failed", error));




