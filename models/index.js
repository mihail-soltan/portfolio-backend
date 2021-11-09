import mongoose  from "mongoose";

export default async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.CONNECTION_URI);
    } catch (error) {
        return error;
    }
}