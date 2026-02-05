const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const bussinessModel = require('../Models/bussinessModel');

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
    await bussinessModel.deleteMany({});
});

describe('Business Controller Tests', () => {
    const testBusiness = {
        name: 'Business Owner',
        email: 'biz@example.com',
        password: 'password123',
        confirmpassword: 'password123',
        address: '456 Biz St',
        phone: '9876543210',
        bussinessName: 'Test Shop',
        bussinessCategory: 'Retail',
        bussinessDescription: 'A test shop',
        agreed: true
    };

    describe('POST /bussiness/registration', () => {
        it('should register a new business successfully', async () => {
            const res = await request(app)
                .post('/bussiness/registration')
                .send(testBusiness);

            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Bussiness created successfully');
            expect(res.body.data.bussinessName).toBe(testBusiness.bussinessName);
        });

        it('should fail if email already exists', async () => {
            await request(app).post('/bussiness/registration').send(testBusiness);
            const res = await request(app).post('/bussiness/registration').send(testBusiness);
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Bussiness already registered with this email');
        });
    });

    describe('POST /bussiness/login', () => {
        it('should login successfully', async () => {
            await request(app).post('/bussiness/registration').send(testBusiness);
            const res = await request(app)
                .post('/bussiness/login')
                .send({
                    email: testBusiness.email,
                    password: testBusiness.password
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        });
    });
});
