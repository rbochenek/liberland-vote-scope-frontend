import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  // Get the block hash from URL params
  const { block_hash } = params;

  // Fetch election data from the backend
  const backendHost = dev ? "localhost:8080" : "liberland-vote-scope:8080";
  const response = await fetch(`http://${backendHost}/council/elections/${block_hash}`);

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`Backend responded with status: ${response.status}`);
  }

  try {
    // Parse the JSON response
    const electionData = await response.json();

    // Log the data to help with debugging
    // console.log('Election data loaded:', electionData);

    // Do a basic validation check to make sure we have the expected data structure
    if (!electionData.electionData || !electionData.electionData.finalResults || !electionData.electionData.rounds) {
      throw new Error('Backend response is missing expected data structure');
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
