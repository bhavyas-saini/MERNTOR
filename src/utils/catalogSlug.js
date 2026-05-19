const slugOverrides = {
  "c++": "c-plus-plus",
  "c#": "c-sharp",
  "html & css": "html-css",
}

export const getCatalogSlug = (name) => {
  const normalizedName = name.toLowerCase().trim()

  if (slugOverrides[normalizedName]) {
    return slugOverrides[normalizedName]
  }

  return normalizedName
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const getCatalogSlugCandidates = (name) => {
  const normalizedName = name.toLowerCase().trim()
  const legacySlug = normalizedName.replace(/\s+/g, "-")

  return [getCatalogSlug(name), legacySlug, encodeURIComponent(legacySlug)]
}
