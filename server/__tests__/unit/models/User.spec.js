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

})
