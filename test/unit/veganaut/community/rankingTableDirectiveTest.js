'use strict';

describe('rankingTableDirective.', function() {
    // TODO: add tests

    /*
     situation 1: far apart
     playerRankIndex = 20
     start = max(20 - 2, 3) = 18
     end = max(20 + 2 + 1, 3) = 23

     situation 2: overlapping
     playerRankIndex = 4
     start = max(4 - 2, 3) = 3
     end = max(4 + 2 + 1, 3) = 7

     situation 3: inside
     playerRankIndex = 1
     start = max(1 - 2, 3) = 3
     end = max(1 + 2 + 1, 3) = 4

     situation 3: completely inside
     playerRankIndex = 1
     top.length = 10
     start = max(1 - 2, 10) = 10
     end = max(1 + 2 + 1, 10) = 10

     situation 4: far apart at the end
     playerRankIndex = 20
     _allRanks.length = 22
     start = max(20 - 2, 3) = 18
     end = min(max(20 + 2 + 1, 3), 22) = min(23, 22) = 22
     */
});
