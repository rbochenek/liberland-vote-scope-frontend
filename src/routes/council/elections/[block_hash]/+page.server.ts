import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  // Get the block hash from URL params
  const { block_hash } = params;

  // Fetch real election data from the API
  // const response = await fetch(`http://localhost:8080/council/elections/${block_hash}`);
  const response = await fetch(`http://liberland-vote-scope:8080/council/elections/${block_hash}`);

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }

  try {
    // Parse the JSON response
    const electionData = await response.json();

    // Log the data to help with debugging
    // console.log('Election data loaded:', electionData);

    // Do a basic validation check to make sure we have the expected data structure
    if (!electionData.electionData || !electionData.electionData.finalResults || !electionData.electionData.rounds) {
      throw new Error('API response is missing expected data structure');
    }

    const data = {
      blockHash: block_hash,
      election: electionData,
    }

    return {
      data
    };
  } catch (err) {
    console.error('Error loading election data:', err);
    // This throws a more detailed error to make debugging easier
    throw error(500, {
      message: `Failed to load election data: ${err.message}`,
      code: 'ELECTION_DATA_FETCH_ERROR'
    });
  }
};
