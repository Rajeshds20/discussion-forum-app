const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log("Database Connected...");
            })
            .catch((error) => {
                throw new Error(error.message);
            });

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
