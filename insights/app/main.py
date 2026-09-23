from fastapi import FastAPI
import pandas as pd 
from datetime import datetime

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analytics")
def analytics(items: list[dict]):
    
    df = pd.DataFrame(items)
    df['expiry_date'] = pd.to_datetime(df[expiry_date])

    total_quantity = df['quantity'].sum()

    # Analytics
    total_donated = int(df[df['status'] == 'donated']['quantity'].sum())
    total_wasted = int(df[df['status'] == 'wasted']['quantity'].sum())
    total_used = int(df[df['status'] == 'used']['quantity'].sum())
    total_available = int(df[df['status'] == 'availible']['quantity'].sum())

    # Analytics percentage
    donated_percentage = round((total_donated / total_quantity) * 100, 2)
    wasted_percentage = round((total_wasted / total_quantity) * 100, 2)
    used_percentage = round((total_used / total_quantity) * 100, 2) 
    available_percentage = round((total_availible / total_quantity) * 100, 2) 



    


    
    return {
        "total_items": len(items),
        "available": sum(item.get("status") == "available" for item in items),
        "donated": sum(item.get("status") == "donated" for item in items),
        "used": sum(item.get("status") == "used" for item in items),
        "wasted": sum(item.get("status") == "wasted" for item in items)
    }
