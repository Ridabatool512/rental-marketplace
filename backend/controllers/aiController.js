const Listing = require("../models/Listing");

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1);
}

function vectorize(text, idf) {
  const words = tokenize(text);
  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
  const vector = new Map();
  for (const [word, count] of counts) {
    vector.set(word, (1 + Math.log(count)) * (idf.get(word) || 1));
  }
  return vector;
}

function cosineSimilarity(left, right) {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (const value of left.values()) leftNorm += value * value;
  for (const value of right.values()) rightNorm += value * value;
  for (const [word, value] of left) dot += value * (right.get(word) || 0);
  if (!leftNorm || !rightNorm) return 0;
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

const getRecommendations = async (req, res) => {
  try {
    const query = String(req.query.query || "").trim().slice(0, 250);
    const category = normalize(req.query.category);
    const location = normalize(req.query.location);
    const maxPrice = req.query.maxPrice === undefined || req.query.maxPrice === ""
      ? null
      : Number(req.query.maxPrice);

    if (req.query.maxPrice !== undefined && req.query.maxPrice !== "" &&
        (!Number.isFinite(maxPrice) || maxPrice < 0)) {
      return res.status(400).json({ message: "Maximum price must be a valid non-negative number." });
    }

    const listings = await Listing.find({
      status: "available",
      quantity: { $gt: 0 },
    })
      .populate("owner", "name")
      .populate("store", "name category location coverImage")
      .limit(250)
      .lean();

    if (!listings.length) {
      return res.status(200).json({
        method: "TF-IDF-inspired content-based ranking",
        recommendations: [],
        message: "There are no available rentals to recommend yet.",
      });
    }

    const documents = listings.map((listing) =>
      tokenize([
        listing.title,
        listing.description,
        listing.category,
        listing.location,
        listing.condition,
        listing.store?.name,
        listing.store?.category,
      ].join(" "))
    );

    const documentFrequency = new Map();
    for (const words of documents) {
      for (const word of new Set(words)) {
        documentFrequency.set(word, (documentFrequency.get(word) || 0) + 1);
      }
    }

    const idf = new Map();
    for (const [word, frequency] of documentFrequency) {
      idf.set(word, Math.log(1 + listings.length / (1 + frequency)));
    }

    const queryText = [query, category, location].filter(Boolean).join(" ");
    const queryVector = vectorize(queryText, idf);

    const scored = listings.map((listing, index) => {
      const itemText = [
        listing.title,
        listing.description,
        listing.category,
        listing.location,
        listing.condition,
        listing.store?.name,
        listing.store?.category,
      ].join(" ");
      const itemVector = vectorize(itemText, idf);
      const textSimilarity = cosineSimilarity(queryVector, itemVector);

      let score = textSimilarity * 70;
      const reasons = [];

      if (category && normalize(listing.category) === category) {
        score += 18;
        reasons.push("matches your category");
      }
      if (location && normalize(listing.location).includes(location)) {
        score += 15;
        reasons.push("matches your location");
      }
      if (maxPrice !== null) {
        if (Number(listing.pricePerDay) <= maxPrice) {
          score += 12;
          reasons.push("within your daily budget");
        } else {
          const overBudgetRatio = (Number(listing.pricePerDay) - maxPrice) / Math.max(maxPrice, 1);
          score -= Math.min(25, overBudgetRatio * 20);
        }
      }
      if (query && textSimilarity > 0.05) reasons.push("similar wording and listing details");
      if (!reasons.length) reasons.push("available rental");

      return {
        ...listing,
        matchScore: Math.max(0, Math.min(100, Math.round(score))),
        recommendationReason: reasons.join(", "),
        _index: index,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore || a.pricePerDay - b.pricePerDay);

    return res.status(200).json({
      method: "TF-IDF-inspired content-based ranking with preference weighting",
      recommendations: scored.slice(0, 8).map(({ _index, ...listing }) => listing),
      totalCandidates: listings.length,
    });
  } catch (error) {
    console.error("AI rental recommendation error:", error.message);
    return res.status(500).json({ message: "Could not generate rental recommendations." });
  }
};

module.exports = { getRecommendations };
