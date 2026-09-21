from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analytics")
def analytics(items: list[dict]):
    return {
        "total_items": len(items),
        "available": sum(item.get("status") == "available" for item in items),
        "donated": sum(item.get("status") == "donated" for item in items),
        "used": sum(item.get("status") == "used" for item in items),
        "wasted": sum(item.get("status") == "wasted" for item in items)
    }
