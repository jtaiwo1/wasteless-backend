const userController = require('../../../controllers/users')
const User = require('../../../models/User')

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson
}));

const mockRes = { status: mockStatus };

// Mock the User model
jest.mock('../../../models/User');

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
})