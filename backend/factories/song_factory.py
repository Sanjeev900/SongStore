"""Factory to build normalized domain rows before DB insertion."""


class SongFactory:
    """Builds complete DB-ready song row dicts."""

    @staticmethod
    def build_rows(flat_rows: list[dict]) -> list[dict]:
        """
        For each row:
        - Add idx=i (0-based index)
        - Add star_rating=0

        Return list of DB-ready row dicts.
        """
        result: list[dict] = []
        for i, row in enumerate(flat_rows):
            db_row = {**row, "idx": i, "star_rating": 0}
            result.append(db_row)
        return result
