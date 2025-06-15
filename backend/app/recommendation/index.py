from pathlib import Path

import faiss
import numpy as np
import numpy.typing as npt
import pandas as pd

from app.constants import General
from app.logger import logger


class FaissIndex:
    def __init__(self) -> None:
        self.path: Path = Path(__file__).parent.parent / "data" / "recommender" / "index.faiss"
        self.embeddings_path: Path = Path(__file__).parent.parent / "data" / "recommender" / "movie_embeddings.csv"

    def build(self) -> None:
        try:
            df = pd.read_csv(self.embeddings_path, header=None)
            movie_vectors = df.values.astype(np.float32)

            n, dim = movie_vectors.shape
            logger.info(f"Successfully loaded movie embeddings.", extra={"count": n, "dim": dim})

            norms = np.linalg.norm(movie_vectors, axis=1)
            if not np.allclose(norms, 1.0, atol=1e-5):
                logger.warning("Vectors are not L2-normalized! Consider normalizing first.")

            ids = np.arange(1, n + 1).astype(np.int64)

            base_index = faiss.IndexFlatIP(dim)
            self.index = faiss.IndexIDMap2(base_index)
            self.index.add_with_ids(movie_vectors, ids)
            logger.info("Successfully created FAISS index with external IDs.")

            faiss.write_index(self.index, str(self.path))
            logger.info(f"Successfully saved FAISS index.", extra={"path": str(self.path)})

        except Exception as err:
            logger.critical(
                "Error: failed to load movie embeddings or build index.",
                extra={"error": str(err), "path": str(self.embeddings_path)},
                exc_info=True,
            )
            raise

    def load(self) -> None:
        try:
            self.index: faiss.Index = faiss.read_index(str(self.path))
            logger.info("Successfully loaded FAISS index.", extra={"path": str(self.path), "ntotal": self.index.ntotal})
        except Exception as err:
            logger.critical(
                "Error: failed to load FAISS index.", extra={"error": str(err), "path": str(self.path)}, exc_info=True
            )
            raise

    def search(self, vector: npt.NDArray[np.float32], k: int = General.K_NEAREST) -> npt.NDArray[np.int64]:
        if self.index is None:
            logger.warning("FAISS index not loaded, attempting to load it now.")
            self.load()

        faiss.normalize_L2(vector)
        distances, indices = self.index.search(vector, k)
        result = np.asarray(indices[0], dtype=np.int64)
        logger.debug(
            "Search completed in FAISS index.",
            extra={
                "result_count": len(result),
                "max_score": float(distances[0][0]),
                "min_score": float(distances[0][-1]),
                "k": k,
            },
        )
        return result


faiss_index = FaissIndex()
