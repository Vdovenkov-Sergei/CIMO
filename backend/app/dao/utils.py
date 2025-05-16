from sqlalchemy.inspection import inspect

EXCEPTIONS = ["hashed_password", "description", "content"]


def orm_to_dict(obj):
    try:
        return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs if c.key not in EXCEPTIONS}
    except Exception:
        return {"repr": str(obj)}


def to_gerund(verb):
    vowels, l = "aeiou", len(verb)
    mask_cvc = [False, True, False]

    # Handle 'die' -> 'dying'
    if verb.endswith("ie"):
        return verb[:-2] + "ying"

    # Avoid double 'e' in 'see'
    elif verb.endswith("e") and not verb.endswith("ee"):
        return verb[:-1] + "ing"

    # Handle 'run' -> 'running' + consonant-vowel-consonant (CVC) rule
    elif (l == 3 or (l > 3 and [verb[-i - 1] in vowels for i in range(3)] == mask_cvc)) and verb[-1] not in "wxy":
        return verb + verb[-1] + "ing"

    return verb + "ing"
