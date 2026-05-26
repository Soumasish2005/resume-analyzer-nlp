import re
import unicodedata

def clean_text(text: str) -> str:
    """
    Full cleaning pipeline for raw extracted resume or JD text.
    Applies all steps in order and returns normalized plain text.
    """
    text = _normalize_unicode(text)
    text = _remove_urls(text)
    text = _remove_emails_phones(text)
    text = _remove_special_characters(text)
    text = _normalize_whitespace(text)
    return text.strip()


def _normalize_unicode(text: str) -> str:
    """
    Converts non-ASCII unicode (smart quotes, em-dashes, etc.)
    to closest ASCII equivalent.
    """
    return unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")


def _remove_urls(text: str) -> str:
    return re.sub(r"http\S+|www\.\S+", "", text)


def _remove_emails_phones(text: str) -> str:
    """
    Strips email addresses and phone numbers from the body text.
    NER handles these separately — we don't want them polluting keyword extraction.
    """
    text = re.sub(r"\S+@\S+\.\S+", "", text)                        # emails
    text = re.sub(r"(\+?\d[\d\s\-().]{7,}\d)", "", text)             # phone numbers
    return text


def _remove_special_characters(text: str) -> str:
    """
    Keeps letters, numbers, spaces, and basic punctuation.
    Removes bullets, symbols, and other noise common in resumes.
    """
    return re.sub(r"[^a-zA-Z0-9\s.,;:()\-/]", " ", text)


def _normalize_whitespace(text: str) -> str:
    """
    Collapses multiple spaces, tabs, and newlines into a single space.
    """
    return re.sub(r"\s+", " ", text)