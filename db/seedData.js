require('dotenv').config();
const { faker } = require('@faker-js/faker');
const { Pool } = require('pg');

const db = new Pool({
    connectionString: process.env.DATABASE_URL

})

const status = ['available', 'donated', 'used', 'wasted']

const foodCategories = [
    { name: "Whole Milk", minLife: 3, maxLife: 7 },
    { name: "Sourdough Bread", minLife: 3, maxLife: 7 },
    { name: "Organic Spinach", minLife: 4, maxLife: 10 },
    { name: "Canned Black Beans", minLife: 300, maxLife: 730 },
    { name: "Jasmine Rice", minLife: 365, maxLife: 1095 },
    { name: "Free Range Eggs", minLife: 14, maxLife: 30 },
    { name: "Cheddar Cheese", minLife: 30, maxLife: 90 },
    { name: "Chicken Breast", minLife: 3, maxLife: 5 },
    { name: "Greek Yogurt", minLife: 10, maxLife: 21 },
    { name: "Rolled Oats", minLife: 180, maxLife: 365 },
    { name: "Canned Tuna", minLife: 365, maxLife: 1460 },
    { name: "All-Purpose Flour", minLife: 180, maxLife: 365 },
    { name: "Bananas", minLife: 4, maxLife: 7 },
    { name: "Strawberries", minLife: 3, maxLife: 6 },
    { name: "Avocado", minLife: 4, maxLife: 8 },
    { name: "Pasta Penne", minLife: 365, maxLife: 730 },
    { name: "Tomato Sauce", minLife: 90, maxLife: 365 }
];


async function seedDataBase() {
    try {
        
        for (let i = 1; i<= 100; i++) {
            const name = faker.food.ingredient();
            const quantity = faker.number.int({min: 1, max: 10});
            const statuses = faker.helpers.arrayElement(status);
            const expiryDate = genExpiryDate(status);

            await db.query(
                'INSERT INTO pantry (name, quantity, expiry_date, status) VALUES ($1, $2, $3, $4)',
                [name, quantity, expiryDate, statuses]
            );

        }
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await db.end();
    }
}

seedDataBase();