import numpy as np
import faiss
from pathlib import Path

N_CLUSTERS = 100
BASE_DIR = Path(__file__).parent.parent

MOVIE_EMBEDDINGS_FILE = BASE_DIR / "data" / "movie_embeddings.csv"
FAISS_INDEX_FILE = BASE_DIR / "data" / "index.faiss"

try:
    movie_vectors = np.loadtxt(MOVIE_EMBEDDINGS_FILE, delimiter=",", dtype=np.float32)
    faiss.normalize_L2(movie_vectors)
    n, dim = movie_vectors.shape
    print(f"Successfully loaded movie embeddings from {MOVIE_EMBEDDINGS_FILE}: count={n}, dim={dim}.")

    quantizer = faiss.IndexFlatIP(dim)
    index = faiss.IndexIVFFlat(quantizer, dim, N_CLUSTERS, faiss.METRIC_INNER_PRODUCT)
    index.train(movie_vectors)
    index.add(movie_vectors)
    print(f"Successfully created FAISS index with {N_CLUSTERS} clusters.")

    faiss.write_index(index, str(FAISS_INDEX_FILE))
    print(f"Successfully saved FAISS index to {FAISS_INDEX_FILE}.")

except Exception as err:
    print(f"Error: failed to load movie embeddings or build index: {err}.")
    raise
