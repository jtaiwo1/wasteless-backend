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


    describe('addItem', () => {
        it('Successful creates a new pantry item and returns a 201 status', async () => {
            const mockbody = 
                { name: 'Milk', quantity: 5 }
            ;
            const mockCreatedItem = {

             id: 1, ...mockbody, user_id: 1
            }
            
            Pantryitem.create.mockResolvedValueOnce(mockCreatedItem);

            const req = { body: mockbody, user: { user_id: 1 } };

            await pantryController.addItem(req, mockRes);

            expect(Pantryitem.create).toHaveBeenCalledWith({
                name: 'Milk',
                quantity: 5,
                user_id: 1
            });
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockCreatedItem);
        });

        it('returns a 409 error response if creation fails', async () => {
            Pantryitem.create.mockRejectedValueOnce(new Error('Item already exists'));
            jest.spyOn(console, 'error').mockImplementation(() => {});

            const req = {
                body: { name: 'Milk', quantity: 2 },
                user: { user_id: 1}
            }

            await pantryController.addItem(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(409);
            expect(mockSend).toHaveBeenCalledWith({ error: "Item already exists" });
        });
    });



});