import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # suppress tensorflow logs

import sys
import json

def extract_embedding(image_url):
    # ---- your face detection & embedding code ----
    embedding = [0.1, 0.2, 0.3]  # replace with real embedding
    return embedding

try:
    image_url = sys.argv[1]
    embedding = extract_embedding(image_url)

    # 🔴 ONLY JSON PRINT
    print(json.dumps({ "embedding": embedding }))

except Exception:
    # NEVER crash Node
    print(json.dumps({ "embedding": [] }))
