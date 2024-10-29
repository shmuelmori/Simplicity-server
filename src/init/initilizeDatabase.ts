import usersData from "../../json/simpicity.users.json";
import User from "../models/user.schema";

export async function addDataToDB(data: any[]) {
    try {
        const transformedData = data.map(item => ({
            ...item,
            _id: item._id.$oid,
            createdAt: new Date(item.createdAt.$date),
            updatedAt: new Date(item.updatedAt.$date),
        }));

        const result = await User.insertMany(transformedData);
        console.log(`Successfully inserted ${result.length} documents`);
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
}

export async function initDB() {
    await addDataToDB(usersData);
    console.log('Database initialization completed');
}