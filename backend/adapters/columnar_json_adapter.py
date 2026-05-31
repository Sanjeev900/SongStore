"""Adapter to convert columnar JSON format into flat row dicts."""


class ColumnarJsonAdapter:
    """Converts columnar JSON into flat row dicts."""

    FIELDS = [
        "id",
        "title",
        "danceability",
        "energy",
        "key",
        "loudness",
        "mode",
        "acousticness",
        "instrumentalness",
        "liveness",
        "valence",
        "tempo",
        "duration_ms",
        "time_signature",
        "num_bars",
        "num_sections",
        "num_segments",
    ]

    @staticmethod
    def to_rows(raw: dict) -> list[dict]:
        """
        Convert columnar JSON to flat row dicts.

        Rules:
        - Iterate over index keys from raw["id"]
        - For every field: raw.get(field, {}).get(idx_str)
        - Missing fields -> None
        - Return flat row dicts only
        - Do NOT add idx
        - Do NOT add star_rating
        """
        rows: list[dict] = []
        id_column = raw.get("id", {})

        for idx_str in id_column.keys():
            row: dict = {}
            for field in ColumnarJsonAdapter.FIELDS:
                row[field] = raw.get(field, {}).get(idx_str)
            rows.append(row)

        return rows
