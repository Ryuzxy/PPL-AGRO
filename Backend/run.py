"""
MowTitis FastAPI Server Runner
"""
import uvicorn

if __name__ == "__main__":
    print("[MowTitis Backend] Starting FastAPI Server on http://localhost:8000 ...")
    print("[MowTitis Backend] Interactive Swagger Docs available at http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
