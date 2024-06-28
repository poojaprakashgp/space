const blocks = [
    {"gym": false, "school": true, "store": false},
    {"gym": true, "school": false, "store": false},
    {"gym": true, "school": true, "store": false},
    {"gym": false, "school": true, "store": false},
    {"gym": false, "school": true, "store": true}
];

const reqs = ["gym", "school", "store"];

function findOptimalBlock(blocks, reqs) {
    const n = blocks.length;
    const distances = {};

    // Initialize distance arrays
    reqs.forEach(req => {
        distances[req] = new Array(n).fill(Infinity);
    });

    // Fill distances from left to right
    reqs.forEach(req => {
        let closest = Infinity;
        for (let i = 0; i < n; i++) {
            if (blocks[i][req]) {
                closest = i;
            }
            distances[req][i] = Math.min(distances[req][i], Math.abs(i - closest));
        }
    });

    // Fill distances from right to left
    reqs.forEach(req => {
        let closest = Infinity;
        for (let i = n - 1; i >= 0; i--) {
            if (blocks[i][req]) {
                closest = i;
            }
            distances[req][i] = Math.min(distances[req][i], Math.abs(i - closest));
        }
    });

    // Find the optimal block
    let optimalBlockIndex = -1;
    let optimalBlockDistance = Infinity;

    for (let i = 0; i < n; i++) {
        let maxDistance = 0;
        reqs.forEach(req => {
            maxDistance = Math.max(maxDistance, distances[req][i]);
        });

        if (maxDistance < optimalBlockDistance) {
            optimalBlockDistance = maxDistance;
            optimalBlockIndex = i;
        }
    }

    return optimalBlockIndex;
}

const optimalBlockIndex = findOptimalBlock(blocks, reqs);
console.log(optimalBlockIndex, blocks[optimalBlockIndex]);
