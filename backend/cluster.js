const stringSimilarity = require('string-similarity');

function clusterArticles(articles, threshold = 0.6) {
    const clusters = [];

    // Sort by date descending so newer articles are processed first within clusters
    // But actually we want the most "representative" one maybe?
    // Let's stick to simple grouping first.

    articles.forEach(article => {
        let added = false;

        for (let cluster of clusters) {
            // Compare with the first article in the cluster (representative)
            const similarity = stringSimilarity.compareTwoStrings(article.title, cluster[0].title);

            if (similarity > threshold) {
                cluster.push(article);
                added = true;
                break;
            }
        }

        if (!added) {
            clusters.push([article]);
        }
    });

    return clusters;
}

module.exports = clusterArticles;
