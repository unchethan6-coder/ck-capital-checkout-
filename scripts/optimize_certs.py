import json, os, time
from PIL import Image

ledger_path = "scripts/seed-data/payouts.json"
ledger = json.load(open(ledger_path))
out_dir = "scripts/seed-data/opt-certs"
os.makedirs(out_dir, exist_ok=True)

t0 = time.time()
converted = 0
for p in ledger["payouts"]:
    if not p.get("display") or not p.get("certPath"):
        continue
    src = p["certPath"]
    if not os.path.exists(src):
        print("Missing:", src)
        continue
    ref = p["ref"]
    folder = p["certFolder"].replace(" ", "_").replace("(", "_").replace(")", "_")
    f_name = p["certFile"].replace(".png", ".webp")
    dest_name = f"{ref}_{folder}_{f_name}"
    dest_path = os.path.join(out_dir, dest_name)
    if not os.path.exists(dest_path) or os.path.getsize(dest_path) < 1000:
        im = Image.open(src)
        im.save(dest_path, "WEBP", quality=85)
    p["optCertPath"] = dest_path
    p["optCertFile"] = dest_name
    converted += 1

json.dump(ledger, open(ledger_path, "w"), indent=2)
print(f"Converted {converted} certificates to WebP in {time.time() - t0:.2f}s!")
