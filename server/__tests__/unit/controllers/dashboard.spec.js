const dashboardController = require('../../../controllers/dashboard')
const { getAnalytics } = require('../../../services/insightsClient')

// Mocking response methods

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

jest.mock('../../../services/insightsClient')

// we are mocking .send(), .json() and .end()

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd
}));

const mockRes = { status: mockStatus}

describe('Dashboard Controlller', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe('index', () => {
        it('Successfully fetches and retrun analytics with  a 200 status', async () => {
            const mockAnalytics = { totalItems : 10, wastedItems: 2 }
            getAnalytics.mockResolvedValueOnce(mockAnalytics)

            const req = { user: { user_id: 1 } }

            await dashboardController.index(req,  mockRes)

            expect(getAnalytics).toHaveBeenCalledWith(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(mockAnalytics)
        })

        it('returns 500 error if getting analytics failed', async () => {
            getAnalytics.mockRejectedValueOnce(new Error('Down'))
            jest.spyOn(console, 'error').mockImplementation(() => {})

            const req = { user: { user_id: 1 } }

            await dashboardController.index(req, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({ error: 'No users found' })
        })
    })
})
