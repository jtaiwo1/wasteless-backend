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
    df['expiry_date'] = pd.to_datetime(df['expiry_date'])
    df['status_update_date'] = pd.to_datetime(df['status_update_date'])



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

    # Advanced Monhtly
    df['effective_date'] = df['status_update_at'].fillna(df['expiry_date'])
    df['year_month'] = df['effective'].dt.to_period('M').astype(str)

    monthly = df.groupby(['year_month', 'status'])['quantity'].sum().unstack(fill_value=0)

    for status_name in ['wasted', 'used', 'donated', 'available']:
        if status_name not in monthly.columns:
            monthly[status_name] = 0

    monthly_analysis = monthly.reset_index().to_dict(orient='records')

    # Expiring soon
    today = pd.Timestamp.now()
    next_7_days = today + pd.Timedelta(days=7)

    expiring_soon_df = df[
        (df['status'] == 'available') &
        (df['expiry_date'] >= today) &
        (df['expiry_date'] <= next_7_days)
    ]

    total_expiring_soon = int(expiring_soon_df['quantity'].sum()) if not expiring_soon_df.empty else 0

    expiring_soon_items = expiring_soon_df[['name', 'quantity', 'expiry_date']].to_dict(orient='records')

    # Current Stock
    current_stock_df = df[df['status']  == 'available']
    current_stock_items = current_stock_df[['name', 'quantity', 'expiry_date']]


    
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
        "monthly_analysis" : monthly_analysis,
        "total_expiring_soon" : total_expiring_soon,
        "current_stock_items" : current_stock_items
    }
