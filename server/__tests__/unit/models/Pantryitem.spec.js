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
            const item = await PantryItem.findById(1, 1)

            expect(item).toBeInstanceOf(PantryItem)
            expect(item.name).toBe('Apple')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM pantry WHERE id = $1 AND user_id = $2", [1, 1]);

        })

        it('returns null when no pantry item is found with the given ID', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            const item = await PantryItem.findById(999, 999)

            expect(item).toBeNull()
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM pantry WHERE id = $1 AND user_id = $2", [999, 999])
        })
    })

    describe('create', () => {

        it ('Successfully creates and returns and new pantry item', async () => {
            const newItem = { id: 1, user_id: 1, name: 'Banana', quantity: 5 }
            const createdRow = {
                id: 3, 
                user_id: 1, 
                name: 'Banana', 
                quantity: 5, 
                expiry_date: null, 
                status: 'available', 
                status_updated_at: null
            }

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [createdRow] })
            const item = await PantryItem.create(newItem)

            expect(item).toBeInstanceOf(PantryItem)
            expect(item.name).toBe('Banana')
            expect(item.quantity).toBe(5)
            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO pantry(user_id, name, quantity, expiry_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [1, 'Banana', 5, null, 'available']
            );

        })

        it('throws an error when item name is missing', async () => {
            const invalidItemData = { user_id: 1, quantity: 2 }
            await expect(PantryItem.create(invalidItemData)).rejects.toThrow("Item name is required")
        })
    })

    describe('updateStatus', ()  => {
        it('successfully updates and returns the pantry item status', async () => {
            const updatedRow = {
                id: 1,
                user_id: 1,
                name: 'Banana',
                quantity: 5,
                status: 'wasted',
                status_updated_at: '2026-09-29'
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedRow] });

            // 1. Instantiate the object first
            const pantryItem = new PantryItem({ id: 1, user_id: 1 });

            // 2. Call the instance method
            const item = await pantryItem.updateStatus('wasted');

            expect(item).toBeInstanceOf(PantryItem);
            expect(item.status).toBe('wasted');
            
            // 3. Verify the SQL query runs correctly
            expect(db.query).toHaveBeenCalledWith(
                "UPDATE pantry SET status = $1, status_update_date = CURRENT_DATE WHERE id = $2 AND user_id = $3 RETURNING *",
                ['wasted', 1, 1]
            );
        });

       it('returns null if no item is found to update', async () => {
            const pantryItem = new PantryItem({ id: 99, user_id: 1 });
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const result = await pantryItem.updateStatus('consumed');

            expect(result).toBeNull();
        });
    })

    describe('destroy', () => {
        it('successfully deletes the pantry item and returns the deleted instance', async () => {
            const pantryItem = new PantryItem({ id: 1, user_id: 1, name: 'Banana' });
            
            const deletedRow = {
                id: 1,
                user_id: 1,
                name: 'Banana',
                quantity: 5,
                expiry_date: null,
                status: 'available',
                status_updated_at: null
            };

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [deletedRow] });

            const result = await pantryItem.destroy();

            expect(result).toBeInstanceOf(PantryItem);
            expect(result.name).toBe('Banana');
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM pantry'),
                [1, 1]
            );
        });

        it('returns null if no item is found to delete', async () => {
            const pantryItem = new PantryItem({ id: 99, user_id: 1 });
            
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });

            const result = await pantryItem.destroy();

            expect(result).toBeNull();
        });
});


    
});