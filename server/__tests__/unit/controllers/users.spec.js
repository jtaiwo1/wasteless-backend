const { genSalt } = require('bcrypt');
const userController = require('../../../controllers/users')
const User = require('../../../models/User')
const bcrypt = require('bcrypt')
const jwt =  require('jsonwebtoken')

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson
}));

const mockRes = { status: mockStatus };

// Mock the User model
jest.mock('../../../models/User');
jest.mock('bcrypt', () => ({
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn()
}))
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}))

describe('User Controller', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())


    describe('index', () => {
        it('successfully fetches and retruns all users with a 200 status', async () => {
            const mockUsers = [
                { user_id: 1, email: 'hello@example.com' },
                { user_id: 2, email: 'bob@example.com' }
            ]

            User.getAll.mockResolvedValueOnce(mockUsers)

            const req = {}

            await userController.index(req, mockRes)

            expect(User.getAll).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(mockUsers)
        })

        it('returns a 500 error if the database  query fails', async () => {
            const errorMessage = 'Database connection failed'
            User.getAll.mockRejectedValueOnce(new Error(errorMessage))
            jest.spyOn(console, 'error').mockImplementation(() => {})

            const req = {}

            await userController.index(req, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({  error: errorMessage })
        })
    })


    describe('getByUsername', () => {
        it('successfully fetches and returns a user by username with a 200 status', async () => {
            const mockUser = { user_id: 1, username: 'johndoe', password: 'hashedpassword' };
            User.getByUsername.mockResolvedValueOnce(mockUser);

            const req = { params: { username: 'johndoe' } };

            await userController.getByUsername(req, mockRes);

            expect(User.getByUsername).toHaveBeenCalledWith('johndoe');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalledWith(mockUser);
        });

        it('returns a 404 error if the user is not found or query fails', async () => {
            const errorMessage = 'User not found';
            User.getByUsername.mockRejectedValueOnce(new Error(errorMessage));
            jest.spyOn(console, 'error').mockImplementation(() => {});

            const req = { params: { username: 'nonexistent' } };

            await userController.getByUsername(req, mockRes);

            expect(User.getByUsername).toHaveBeenCalledWith('nonexistent');
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockSend).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('register', () => {
        it('returns a 400 error if username or password is missing', async () => {
            const req = { body: { username: 'alice' } }; // missing password

            await userController.register(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockSend).toHaveBeenCalledWith({ error: "Missing username or password" });
        });

        it('returns a 409 error if the username is already taken', async () => {
            User.getByUsername.mockResolvedValueOnce({ user_id: 1, username: 'alice' });

            const req = { body: { username: 'alice', password: 'password123' } };

            await userController.register(req, mockRes);

            expect(User.getByUsername).toHaveBeenCalledWith('alice');
            expect(mockStatus).toHaveBeenCalledWith(409);
            expect(mockSend).toHaveBeenCalledWith({ error: "Username already taken" });
        });

        it('successfully registers a new user with a 201 status', async () => {
            User.getByUsername.mockResolvedValueOnce(null);
            bcrypt.genSalt.mockResolvedValueOnce('mockSalt');
            bcrypt.hash.mockResolvedValueOnce('hashedPassword');
            User.create.mockResolvedValueOnce({ user_id: 1, username: 'alice' });

            const req = { body: { username: 'alice', password: 'password123' } };

            await userController.register(req, mockRes);

            expect(bcrypt.genSalt).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockSalt');
            expect(User.create).toHaveBeenCalledWith({
                username: 'alice',
                password: 'hashedPassword'
            });
            expect(mockStatus).toHaveBeenCalledWith(201);
        });

        it('returns a 401 error if registration fails in catch block', async () => {
            User.getByUsername.mockResolvedValueOnce(null);
            bcrypt.genSalt.mockRejectedValueOnce(new Error('Hashing failed'));
            jest.spyOn(console, 'error').mockImplementation(() => {});

            const req = { body: { username: 'alice', password: 'password123' } };

            await userController.register(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockSend).toHaveBeenCalledWith({ error: 'Hashing failed' });
        });
    });


    describe('login', () => {
        it('returns a 400 error if username or password is missing', async () => {
            const req = { body: { username: 'alice' } }; // missing password

            await userController.login(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockSend).toHaveBeenCalledWith({ error: "Missing username or password" });
        });

        it('returns a 401 error if the password does not match', async () => {
            User.getByUsername.mockResolvedValueOnce({ user_id: 1, username: 'alice', password: 'hashedPassword' });
            bcrypt.compare.mockResolvedValueOnce(false); // password mismatch

            const req = { body: { username: 'alice', password: 'wrongpassword' } };

            await userController.login(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockSend).toHaveBeenCalledWith({ error: "The password is incorrect" });
        });

        it('successfully logs in a user and returns a token with a 200 status', async () => {
            User.getByUsername.mockResolvedValueOnce({ user_id: 1, username: 'alice', password: 'hashedPassword' });
            bcrypt.compare.mockResolvedValueOnce(true); // password matches

            // jwt.sign takes a callback (err, token)
            jwt.sign.mockImplementationOnce((payload, secret, options, callback) => {
                callback(null, 'mockToken123');
            });

            const req = { body: { username: 'alice', password: 'password123' } };

            await userController.login(req, mockRes);

            expect(jwt.sign).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockSend).toHaveBeenCalledWith({
                success: true,
                token: 'mockToken123',
                user_id: 1
            });
        });

        it('returns a 404 error if user is not found or an exception occurs', async () => {
            User.getByUsername.mockRejectedValueOnce(new Error('User not found'));
            jest.spyOn(console, 'error').mockImplementation(() => {});

            const req = { body: { username: 'unknown', password: 'password123' } };

            await userController.login(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockSend).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });
})