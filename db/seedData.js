require('dotenv').config();
const { faker } = require('@faker-js/faker');
const { Pool } = require('pg');

const db = new Pool({
    connectionString: process.env.DATABASE_URL})

const status = ['available', 'donated', 'used', 'wasted']

function genExpiryDate(status) {

    let date;

    if (status === 'available') {
        date = faker.date.soon({ days: 60});
    } else {
        date = faker.date.recent({ days: 180 });
    }
    return date.toISOString().split('T')[0];
}

async function seedDataBase() {
    try {
        
        for (let i = 1; i<= 100; i++) {
            const name = faker.food.ingredient();
            const quantity = faker.number.int({min: 1, max: 10});
            const statuses = faker.helpers.arrayElement(status);
            const expiryDate = genExpiryDate(status);

            await db.query(
                'INSERT INTO pantry_items (name, quantity, expiry_date, status) VALUES ($1, $2, $3, $4)',
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