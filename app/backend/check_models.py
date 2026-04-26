"""
Quick script to check if model files exist
Run this on Render to debug model loading issues
"""
from pathlib import Path
import os

print("="*80)
print("MODEL FILES CHECK")
print("="*80)

# Check environment
print(f"\nEnvironment: {'Render' if os.environ.get('RENDER') else 'Local'}")
print(f"Working directory: {Path.cwd()}")

# Check backend models directory
backend_models = Path(__file__).parent / "models"
print(f"\nBackend models directory: {backend_models}")
print(f"Exists: {backend_models.exists()}")

if backend_models.exists():
    print("\nFiles in backend/models:")
    for file in backend_models.iterdir():
        size_mb = file.stat().st_size / (1024 * 1024)
        print(f"  - {file.name} ({size_mb:.2f} MB)")
else:
    print("  ❌ Directory does not exist!")

# Check notebooks directory
notebooks_dir = Path(__file__).parent.parent.parent / "notebooks"
print(f"\nNotebooks directory: {notebooks_dir}")
print(f"Exists: {notebooks_dir.exists()}")

if notebooks_dir.exists():
    print("\nModel files in notebooks:")
    for pattern in ["*.pkl", "*.pth"]:
        for file in notebooks_dir.glob(pattern):
            size_mb = file.stat().st_size / (1024 * 1024)
            print(f"  - {file.name} ({size_mb:.2f} MB)")

# Check specific model files
print("\n" + "="*80)
print("REQUIRED MODEL FILES")
print("="*80)

required_models = [
    backend_models / "best_model_pca.pkl",
    backend_models / "best_cnn_final.pth",
    backend_models / "best_cnn_scratch.pth",
]

for model_path in required_models:
    exists = model_path.exists()
    status = "✅" if exists else "❌"
    size = f"({model_path.stat().st_size / (1024 * 1024):.2f} MB)" if exists else ""
    print(f"{status} {model_path.name} {size}")

print("="*80)
