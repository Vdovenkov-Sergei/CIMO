from app.recommendation.index import FaissIndex, faiss_index


class RecommendationService:
    def __init__(self, *, faiss_index: FaissIndex) -> None:
        self.faiss_index = faiss_index

    async def update_user_vector(
        self, user_id: int, movie_id: int, time_swiped: int, is_liked: bool = False, is_open_full_info: bool = False
    ) -> None:
        pass

    async def get_new_movie(self, user_id: int, is_pair: bool = False, is_onboarding: bool = False) -> int:
        pass


recommender = RecommendationService(faiss_index=faiss_index)
