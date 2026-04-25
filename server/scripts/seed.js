const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

const Test = require('../models/test');
const Category = require('../models/category');
const TestDesc = require('../models/testDesc');

const { categoryMap, testsDescription } = require('../models/db/seedData');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const seedDatabase = async () => {
  try {
    await mongoose.connect(DB);

    console.log('Clearing old config data...');
    await Category.deleteMany({});
    await Test.deleteMany({});
    await TestDesc.deleteMany({});

    console.log('Seeding new config data...');

    for (const [categoryName, testNames] of Object.entries(categoryMap)) {
      const category = await Category.create({ name: categoryName });

      for (const testName of testNames) {
        const test = await Test.create({
          name: testName,
          category_id: category._id,
        });

        const testConfigData = testsDescription[testName];

        const descriptions = ['easy', 'medium', 'hard'].map((difficulty) => ({
          test_id: test._id,
          difficulty: difficulty,
          config: testConfigData[difficulty],
        }));

        await TestDesc.insertMany(descriptions);
      }
    }

    console.log('Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
