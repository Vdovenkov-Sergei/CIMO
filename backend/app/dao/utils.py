from typing import Any

from sqlalchemy.inspection import inspect

from app.constants import General


def orm_to_dict(obj: Any) -> dict[str, Any]:
    try:
        return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs if c.key not in General.EXCEPTIONS}
    except Exception:
        return {"repr": str(obj)}


def to_gerund(verb: str) -> str:
    len_verb = len(verb)

    # Handle 'die' -> 'dying'
    if verb.endswith("ie"):
        return verb[:-2] + "ying"

    # Avoid double 'e' in 'see'
    elif verb.endswith("e") and not verb.endswith("ee"):
        return verb[:-1] + "ing"

    # Handle 'run' -> 'running' + consonant-vowel-consonant (CVC) rule
    elif verb[-1] not in "wxy" and (
        len_verb == 3 or (len_verb > 3 and [verb[-i - 1] in General.VOWELS for i in range(3)] == General.CVC_MASK)
    ):
        return verb + verb[-1] + "ing"

    return verb + "ing"
