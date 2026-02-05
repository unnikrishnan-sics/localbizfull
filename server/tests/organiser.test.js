const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const organisationModel = require('../Models/organiserModel');

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
    await organisationModel.deleteMany({});
});

describe('Organiser Controller Tests', () => {
    const testOrganiser = {
        organizationName: 'Test Org',
        organizationType: 'NGO',
        name: 'Organiser Name',
        email: 'org@example.com',
        password: 'password123',
        confirmpassword: 'password123',
        address: '789 Org St',
        phone: '5555555555',
        agreed: true
    };

    describe('POST /organisation/registration', () => {
        it('should register a new organiser successfully', async () => {
            const res = await request(app)
                .post('/organisation/registration')
                .send(testOrganiser);

            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Organization created successfully');
            expect(res.body.data.organizationName).toBe(testOrganiser.organizationName);
        });
    });

    describe('POST /organisation/login', () => {
        it('should login successfully', async () => {
            await request(app).post('/organisation/registration').send(testOrganiser);
            const res = await request(app)
                .post('/organisation/login')
                .send({
                    email: testOrganiser.email,
                    password: testOrganiser.password
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        });
    });
});
