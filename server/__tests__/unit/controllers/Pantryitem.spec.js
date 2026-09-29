const pantryController = require('../../../controllers/pantry')
const Pantryitem = require('../../../models/PantryItem')

// Mocking response methods
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

jest.mock('../../../models/PantryItem')

// we are mocking .send(), .json() and .end()
const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}));

const mockRes = { status: mockStatus };

describe('Pantry Controller', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        it('successfully fetches and returns all pantry items with a 200 status', async () => {
            const mockRows = [
                { id: 1, name: 'Apple', quantity: 5, user_id: 1 }
            ];
            
            Pantryitem.findByUserId.mockResolvedValueOnce(mockRows);

            const req = { user: { user_id: 1 } };

            await pantryController.index(req, mockRes);

            expect(Pantryitem.findByUserId).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockRows);
        });

        it('returns a 500 error response if the database query fails', async () => {
            Pantryitem.findByUserId.mockRejectedValueOnce(new Error('Database error'));
            jest.spyOn(console, 'error').mockImplementation(() => {});

            const req = { user: { user_id: 1 } };

            await pantryController.index(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "Database request failed" });
        });
    });
});