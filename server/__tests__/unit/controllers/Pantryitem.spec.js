const pantryController = require('../../../controllers/pantry')
const PantryItem = require('../../../models/PantryItem')

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
            
            PantryItem.findByUserId.mockResolvedValueOnce(mockRows);

            const req = { user: { user_id: 1 } };

            await pantryController.index(req, mockRes);

            expect(PantryItem.findByUserId).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockRows);
        });

        it('returns a 500 error response if the database query fails', async () => {
            PantryItem.findByUserId.mockRejectedValueOnce(new Error('Database error'));
            jest.spyOn(console, 'error').mockImplementation(() => {});

            const req = { user: { user_id: 1 } };

            await pantryController.index(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "Database request failed" });
        });
    }); 


    describe('addItem', () => {
        it('Successful creates a new pantry item and returns a 201 status', async () => {
            const mockbody = { name: 'Milk', quantity: 5 };
            const mockCreatedItem = { id: 1, ...mockbody, user_id: 1 };
            
            PantryItem.create.mockResolvedValueOnce(mockCreatedItem);

            const req = { body: mockbody, user: { user_id: 1 } };

            await pantryController.addItem(req, mockRes);

            expect(PantryItem.create).toHaveBeenCalledWith({
                name: 'Milk',
                quantity: 5,
                user_id: 1
            });
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockCreatedItem);
        });

        it('returns a 409 error response if creation fails', async () => {
            PantryItem.create.mockRejectedValueOnce(new Error('Item already exists'));
            jest.spyOn(console, 'error').mockImplementation(() => {});

            const req = {
                body: { name: 'Milk', quantity: 2 },
                user: { user_id: 1}
            };

            await pantryController.addItem(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(409);
            expect(mockSend).toHaveBeenCalledWith({ error: "Item already exists" });
        });
    });


    describe('updateStatus', () => {
        it('returns 400 error if invalid status is given', async () => {
            const req = {
                params: { id: "1"},
                user: { user_id: 1 },
                body: { status: 'dead'}
            };

            await pantryController.updateStatus(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid pantry status'});
        });

        it('returns a 404 error if the pantry item is not found', async () => {
            PantryItem.findById.mockResolvedValueOnce(null);

            const req ={
                params: { id: '999' },
                user:  { user_id: 1 },
                body: { status: 'used'}
            };

            await pantryController.updateStatus(req, mockRes);

            expect(PantryItem.findById).toHaveBeenCalledWith('999', 1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Pantry item not found' });
        });

        it('successfully updates and returns the pantry item status', async () => {
            const mockItem = {
                updateStatus: jest.fn().mockResolvedValueOnce({ id: 1, status: 'used'})
            };
            PantryItem.findById.mockResolvedValueOnce(mockItem);

            const req = {
                params: { id: '1' },
                user: { user_id: 1 },
                body: { status: 'used' }
            };

            await pantryController.updateStatus(req, mockRes);

            expect(mockItem.updateStatus).toHaveBeenCalledWith('used');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                pantryItem: {  id: 1, status: 'used'}
            });
        });
    });


    describe('deleteItem', () => {
        it('Successfully deletes a pantry item and returns a 204', async () => {
            const mockItem = {
                destroy: jest.fn().mockResolvedValueOnce(true)
            };

            PantryItem.findById.mockResolvedValueOnce(mockItem);

            const req = {
                params: { id: '1' },
                user: { user_id: 1 }
            };

            await pantryController.deleteItem(req, mockRes);

            expect(PantryItem.findById).toHaveBeenCalledWith(1, 1);
            expect(mockItem.destroy).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockSend).toHaveBeenCalled(); 
        });

        it('returns a 404 error if item cannot be found or deleted', async () => {
            PantryItem.findById.mockResolvedValueOnce(null);

            const req = {
                params: { id: '999' },
                user: { user_id: 1 }
            };

            await pantryController.deleteItem(req, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(expect.any(Object));
        });
    }); 
});