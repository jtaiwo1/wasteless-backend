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
                { id: 2, user_id: 1, name: 'Milk', quantity: 5, expiry_date: null, status: 'available', status_update_date: null }
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

    describe('findById', () => {

        it ('Shows a pantry item when a ID is provided', async () => {
            const mockItem = { id: 1, user_id: 1, name: 'Apple', quantity: 5, expiry_date: null, status: 'available', status_update_date: null}

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockItem] })
            const item = await PantryItem.findById(1)

            expect(item).toBeInstanceOf(PantryItem)
            expect(item.name).toBe('Apple')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM pantry WHERE id = $1", [1]);

        })

        it('returns null when no pantry item is found with the given ID', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            const item = await PantryItem.findById(999)

            expect(item).toBeNull()
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM pantry WHERE id = $1", [999])
        })
    })
});