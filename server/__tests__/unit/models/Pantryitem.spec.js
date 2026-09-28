const pantryItem = require('../../../models/PantryItem');
const db = require('../../../db/connect');
const PantryItem = require('../../../models/PantryItem');

describe('PantryItem', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('findAll', () => {
        it('pantry items on a successful db query', async () => {
            const mockPantry = [
                { id: 1, user_id: 1, name: 'Apple', quantity: 10, expiry_date: null, status: 'available', status_updated_at: null },
                { id: 2, user_id: 1, name: 'Milk', quantity: 5, expiry_date: null, status: 'available', status_updated_at: null }
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockPantry})

            const items = await PantryItem.findAll()

            expect(items).toHaveLength(2);
            expect(items[0].name).toBe('Apple');
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM pantry ORDER BY id");
        })

        it('should show empty array when no itmes are found', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const items = await PantryItem.findAll();

            expect(items).toEqual([])
            expect(items).toHaveLength(0)
        
        });
    });
});