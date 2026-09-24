from fastapi import FastAPI
import pandas as pd 
from datetime import datetime

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analytics")
def analytics(items: list[dict]):

    print(f"SUCCESS: Received {len(items)} items from Express!")
    if len(items) > 0:
        print("Sample item:", items[0])
    
    df = pd.DataFrame(items)
    df['expiry_date'] = pd.to_datetime(df['expiry_date'])

    total_quantity = df['quantity'].sum()

    # Analytics
    total_donated = int(df[df['status'] == 'donated']['quantity'].sum())
    total_wasted = int(df[df['status'] == 'wasted']['quantity'].sum())
    total_used = int(df[df['status'] == 'used']['quantity'].sum())
    total_available = int(df[df['status'] == 'available']['quantity'].sum())

    # Analytics percentage
    donated_percentage = round((total_donated / total_quantity) * 100, 2) if total_quantity > 0 else 0
    wasted_percentage = round((total_wasted / total_quantity) * 100, 2) if total_quantity > 0 else 0
    used_percentage = round((total_used / total_quantity) * 100, 2) if total_quantity > 0 else 0
    available_percentage = round((total_available / total_quantity) * 100, 2) if total_quantity > 0 else 0

    # Advanced


    
    return {
        "total_items": int(total_quantity),
        "total_donated": total_donated,
        "donated_percentage": donated_percentage,
        "total_wasted": total_wasted,
        "wasted_percentage": wasted_percentage,
        "total_used": total_used,
        "used_percentage": used_percentage,
        "total_available": total_available,
        "available_percentage": available_percentage,
    }
