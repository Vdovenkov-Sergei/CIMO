from pathlib import Path

import faiss
import numpy as np
import numpy.typing as npt

from app.constants import General
from app.logger import logger


class FaissIndex:
    def __init__(self) -> None:
        self.path: Path = Path(__file__).parent.parent / "data" / "recommender" / "index.faiss"

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
        _, indices = self.index.search(vector, k)
        result = np.asarray(indices[0], dtype=np.int64)
        logger.debug("Search completed in FAISS index.", extra={"result_count": len(indices), "k": k})
        return result


faiss_index = FaissIndex()
