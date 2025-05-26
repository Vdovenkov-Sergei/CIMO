import faiss
import numpy as np
from pathlib import Path

from app.logger import logger


class FaissIndex:
    def __init__(self) -> None:
        self.index: faiss.Index | None = None
        self.path: Path = Path(__file__).parent.parent / "data" / "index.faiss"

    def load(self) -> None:
        try:
            self.index = faiss.read_index(str(self.path))
            logger.info("Successfully loaded FAISS index.", extra={"path": str(self.path), "ntotal": self.index.ntotal})
        except Exception as err:
            logger.critical(
                "Error: failed to load FAISS index.", extra={"error": str(err), "path": str(self.path)}, exc_info=True
            )
            raise

    def search(self, vector: np.ndarray, k: int = 10) -> tuple[np.ndarray, np.ndarray]:
        if self.index is None:
            logger.warning("FAISS index not loaded, attempting to load it now.")
            self.load()
        distances, indices = self.index.search(vector, k)
        logger.debug("Search completed in FAISS index.", extra={"result_count": len(indices), "k": k})
        return distances, indices


faiss_index = FaissIndex()
