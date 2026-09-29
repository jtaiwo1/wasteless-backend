const User = require('../../../models/User')
const db = require('../../../db/connect')

jest.mock('../../../db/connect', () => ({
    query: jest.fn()
}))

describe('User Model', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getAll', () => {
        it('Should retrun all users', async () => {
            const user = [
                { user_id: 1, username: 'user1', password: 'password123'},
                { user_id: 2, username: 'user2', password: 'password987'}
            ]

            db.query.mockResolvedValueOnce({ rows: user })
            const users = await User.getAll()

            expect(users).toHaveLength(2)
            expect(users[0]).toBeInstanceOf(User)
            expect(users[0].username).toBe('user1')
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users'))
        })

        it('should throw an error if no users available', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })

            await expect(User.getAll()).rejects.toThrow("No users available")
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users'))
        })
    })

    describe('getByUsername', () => {
        it('should return user when valid username is provided', async () => {
            const mock = {
                user_id: 1,
                username: 'user1',
                password: 'password'
            }
            db.query.mockResolvedValueOnce({ rows: [mock] })

            const user = await User.getByUsername('user1')

            expect(user).toEqual(mock)
            expect(user.username).toBe('user1')
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM users WHERE username = $1'), 
                ['user1']
            )
        })

        it('should return null when the username does not exist', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            const user = await User.getByUsername('user2');

            expect(user).toBeNull();
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM users WHERE username = $1;'),
                ['user2']
            );
        })
    })

    describe('create', () => {
        it('should successfully create and return a new user instance', async () => {
            const rawData = { username: 'user1', password: 'password123' }
            const mockUser = { user_id: 1, username: 'user1', password: 'password123' }

            db.query.mockResolvedValueOnce({ rows: [mockUser] })

            const user = await User.create(rawData)

            expect(user).toBeInstanceOf(User)
            expect(user.username).toBe('user1')
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                ['user1', 'password123']
            )
        })

        it('should throw an error if username is missing', async () => {
            const rawData = { password: 'password123' }

            await expect(User.create(rawData)).rejects.toThrow('username is missing')
            expect(db.query).not.toHaveBeenCalledWith()
        })

        it('should throw an error if password is missing', async () => {
            const rawData = { username: 'user1' }
            await expect(User.create(rawData)).rejects.toThrow('Password is missing')
            expect(db.query).not.toHaveBeenCalledWith()
        })

        it('should throw a generic error if the database query fails', async () => {
            const rawData = { username: 'testuser', password: 'securepassword' };
            db.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(User.create(rawData)).rejects.toThrow("Username is missing");
        });
    })

})
