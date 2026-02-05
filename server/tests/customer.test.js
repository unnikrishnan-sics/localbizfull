const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const customerModel = require('../Models/customerModel');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    process.env.SECRET_KEY = 'test_secret';

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await customerModel.deleteMany({});
});

describe('Customer Controller Tests', () => {
    const testCustomer = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmpassword: 'password123',
        address: '123 Test St',
        phone: '1234567890',
        agreed: true
    };

    describe('POST /customer/registration', () => {
        it('should register a new customer successfully', async () => {
            const res = await request(app)
                .post('/customer/registration')
                .field('name', testCustomer.name)
                .field('email', testCustomer.email)
                .field('password', testCustomer.password)
                .field('confirmpassword', testCustomer.confirmpassword)
                .field('address', testCustomer.address)
                .field('phone', testCustomer.phone)
                .field('agreed', testCustomer.agreed);

            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Customer created successfully');
            expect(res.body.data.email).toBe(testCustomer.email);
        });

        it('should fail if email is already registered', async () => {
            await request(app).post('/customer/registration').send(testCustomer); // Simplified send as long as no file

            const res = await request(app)
                .post('/customer/registration')
                .send(testCustomer);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Customer already registered with this email');
        });

        it('should fail if passwords do not match', async () => {
            const invalidCustomer = { ...testCustomer, confirmpassword: 'wrong' };
            const res = await request(app)
                .post('/customer/registration')
                .send(invalidCustomer);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Password and Confirm Password should be same.');
        });
    });

    describe('POST /customer/login', () => {
        it('should login successfully with correct credentials', async () => {
            // First register
            await request(app).post('/customer/registration').send(testCustomer);

            const res = await request(app)
                .post('/customer/login')
                .send({
                    email: testCustomer.email,
                    password: testCustomer.password
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('customer logged in successfully');
            expect(res.body.token).toBeDefined();
        });

        it('should fail with incorrect password', async () => {
            await request(app).post('/customer/registration').send(testCustomer);

            const res = await request(app)
                .post('/customer/login')
                .send({
                    email: testCustomer.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Invalid Password.');
        });

        it('should fail if customer does not exist', async () => {
            const res = await request(app)
                .post('/customer/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe('customer not found with this email.');
        });
    });
});
