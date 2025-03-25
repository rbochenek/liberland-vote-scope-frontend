// routes/elections/at/[block_hash]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  // Get the block hash from URL params
  const { block_hash } = params;

  // In a real implementation, you would fetch data from your blockchain here
  // For now, generate mock data based on the block_hash

  try {
    // If block_hash is 'latest', use current timestamp as a seed
    // Otherwise use the block_hash as a seed for consistent results
    const mockData = generateMockElectionData(block_hash);

    return {
      blockHash: block_hash,
      electionData: mockData
    };
  } catch (err) {
    console.error('Error loading election data:', err);
    throw error(500, 'Failed to load election data');
  }
};

/**
 * Generates mock election data for demonstration purposes
 */
function generateMockElectionData(blockHash: string) {
  // Use the block hash as a seed for random data generation
  // This ensures consistent results for the same block hash
  const seed = blockHash === 'latest'
    ? Date.now().toString()
    : blockHash;

  // Simple seeded random function
  const seededRandom = createSeededRandom(seed);

  // Generate candidate names and stakes
  const candidateNames = [
    'Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace',
    'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah',
    'Olivia', 'Peter', 'Quinn', 'Ruby', 'Sam', 'Taylor'
  ];

  // Shuffle the candidates to make them different for each block hash
  const shuffledCandidates = shuffleArray([...candidateNames], seededRandom);

  // Create candidates with random initial stakes
  const candidates = shuffledCandidates.slice(0, 18).map(name => ({
    id: name,
    initialStake: Math.floor(4000 + seededRandom() * 5000)
  }));

  // Generate voter data
  const voters = [];
  for (let i = 1; i <= 20; i++) {
    // Each voter votes for 2-3 candidates
    const voteCount = 2 + Math.floor(seededRandom() * 2);
    const votedCandidates = shuffleArray([...candidates], seededRandom)
      .slice(0, voteCount)
      .map(c => c.id);

    voters.push({
      id: `Voter${i}`,
      stake: Math.floor(1000 + seededRandom() * 2000),
      votes: votedCandidates
    });
  }

  // Generate election rounds data
  const candidateScores = candidates.map(c => ({
    candidate: c.id,
    // Initial score is partly based on initialStake but with variations
    score: 0.0001 + (seededRandom() * 0.0004)
  }));

  // Sort by score descending (higher score = more likely to be elected)
  candidateScores.sort((a, b) => b.score - a.score);

  // Assign roles based on position (top 7 are Members, next 7 are RunnersUp)
  const finalResults = candidateScores.map((score, index) => {
    // Get the original candidate data
    const candidate = candidates.find(c => c.id === score.candidate);

    // Calculate final stake (inversely related to score - higher score means lower final stake)
    const finalStake = Math.max(
      2000,
      Math.floor(candidate.initialStake - (score.score * 1000000))
    );

    // Determine role based on position
    let role;
    if (index < 7) {
      role = 'Member';
    } else if (index < 14) {
      role = 'RunnerUp';
    } else {
      role = 'NotElected';
    }

    return {
      candidate: candidate.id,
      role,
      finalScore: score.score,
      initialStake: candidate.initialStake,
      finalStake
    };
  });

  // Generate some rounds data
  const rounds = [];
  for (let i = 1; i <= 4; i++) {
    // Create a progression towards the final scores
    const roundScores = finalResults.map(result => {
      // Progress from a random starting point to final score
      const finalScore = result.finalScore;
      const startScore = finalScore * 0.5 + finalScore * 0.5 * seededRandom();
      const progression = i / 4;

      // Score approaches final score as rounds progress
      const score = startScore + (finalScore - startScore) * progression;

      return {
        candidate: result.candidate,
        score,
        role: result.role
      };
    });

    // Sort by score for this round
    roundScores.sort((a, b) => b.score - a.score);

    // Create vote distribution data
    const voteDistribution = roundScores.map(score => {
      // Calculate stake applied based on score (inverse relationship)
      const stakeApplied = Math.floor(10000 - score.score * 10000000);

      return {
        candidate: score.candidate,
        stakeApplied,
        voterCount: Math.floor(1 + seededRandom() * 5) // Random number of voters
      };
    });

    rounds.push({
      roundNumber: i,
      scores: roundScores,
      voteDistribution
    });
  }

  // Return the complete dataset
  return {
    rounds,
    candidates,
    voters,
    finalResults,
    councilSeats: {
      members: 7,
      runnersUp: 7
    },
    blockHash
  };
}

/**
 * Creates a seeded random number generator for consistent results
 */
function createSeededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return function () {
    hash = Math.sin(hash) * 10000;
    return hash - Math.floor(hash);
  };
}

/**
 * Shuffles an array using the Fisher-Yates algorithm with a seeded random function
 */
function shuffleArray<T>(array: T[], randomFn: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
