<!-- routes/+page.svelte -->
<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let blockHash = "";
  let historicalElection = "";
  let customButtonDisabled = true;
  let historicalButtonDisabled = true;

  // Handle block hash validation
  function validateBlockHash(hash) {
    hash = hash.trim();
    // Block hash validation - must be 64 hex chars or 0x + 64 hex chars
    let isValid = false;

    if (hash.startsWith("0x")) {
      isValid = /^0x[0-9a-fA-F]{64}$/.test(hash);
    } else {
      isValid = /^[0-9a-fA-F]{64}$/.test(hash);
    }

    return isValid;
  }

  // Navigation handlers
  function navigateToLatest() {
    goto("/elections/at/latest");
  }

  function navigateToCustomBlock() {
    if (validateBlockHash(blockHash)) {
      goto(`/elections/at/${blockHash}`);
    }
  }

  function navigateToHistorical() {
    if (historicalElection) {
      // Map election IDs to their corresponding block hashes
      const blockHashMap = {
        "election-2025-01-30":
          "0x1b983f5466bdf8675ddace127e48f809ea899246cb99d7a78d067d4a7e1de27d",
        "election-2023-q3":
          "0x6789abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        "election-2023-q2":
          "0x5678abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        "election-2023-q1":
          "0x4567abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        "election-2022-q4":
          "0x3456abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      };

      const hash = blockHashMap[historicalElection];
      goto(`/elections/at/${hash}`);
    }
  }

  // Update button state when inputs change
  $: customButtonDisabled = !validateBlockHash(blockHash);
  $: historicalButtonDisabled = !historicalElection;
</script>

<div class="container">
  <div class="header">
    <h1>Welcome to Liberland Vote Scope</h1>
    <p>
      Understand how Council elections work on the Liberland blockchain through
      interactive visualizations of the Weighted Phragmen algorithm.
    </p>
  </div>

  <div class="options-container">
    <!-- Option 1: Latest Block -->
    <div class="option-card">
      <div class="option-header">
        <h2>Current Blockchain State</h2>
      </div>
      <div class="option-body">
        <div class="option-description">
          <p>
            Simulate Council elections using the latest blockchain data.
            Visualize how elections would result if conducted at the current
            block.
          </p>
        </div>
        <div class="option-form">
          <button class="button" on:click={navigateToLatest}>
            View Current Simulation
          </button>
        </div>
      </div>
    </div>

    <!-- Option 2: Custom Block Hash -->
    <div class="option-card">
      <div class="option-header">
        <h2>Custom Block</h2>
      </div>
      <div class="option-body">
        <div class="option-description">
          <p>
            Enter a specific block hash to analyze election results from any
            point in the blockchain's history.
          </p>
        </div>
        <div class="option-form">
          <div class="input-group">
            <label for="block-hash">Block Hash</label>
            <input
              type="text"
              id="block-hash"
              placeholder="0x..."
              bind:value={blockHash}
            />
          </div>
          <button
            class="button"
            disabled={customButtonDisabled}
            on:click={navigateToCustomBlock}
          >
            Analyze This Block
          </button>
        </div>
      </div>
    </div>

    <!-- Option 3: Past Elections -->
    <div class="option-card">
      <div class="option-header">
        <h2>Historical Elections</h2>
      </div>
      <div class="option-body">
        <div class="option-description">
          <p>
            Choose from pre-defined historical elections to see how the council
            membership has evolved over time.
          </p>
        </div>
        <div class="option-form">
          <div class="input-group">
            <label for="historical-election">Select Election</label>
            <select id="historical-election" bind:value={historicalElection}>
              <option value="">-- Select an election --</option>
              <option value="election-2025-01-30">Election 2025 Jan 30th</option
              >
              <option value="election-2023-q3">Election Q3 2023</option>
              <option value="election-2023-q2">Election Q2 2023</option>
              <option value="election-2023-q1">Election Q1 2023</option>
              <option value="election-2022-q4">Election Q4 2022</option>
            </select>
          </div>
          <button
            class="button"
            disabled={historicalButtonDisabled}
            on:click={navigateToHistorical}
          >
            View Historical Election
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>Liberland Vote Scope &copy; 2025</p>
  </div>
</div>

<style>
  :global(body) {
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    color: #1f2937;
    background-color: #f9fafb;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
    padding-top: 40px;
  }

  .header h1 {
    margin-bottom: 10px;
    color: #1e40af;
  }

  .header p {
    font-size: 1.1rem;
    color: #6b7280;
    max-width: 800px;
    margin: 0 auto;
  }

  .options-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 768px) {
    .options-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .option-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .option-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .option-header {
    padding: 20px;
    background-color: #eff6ff;
    border-bottom: 1px solid #e5e7eb;
  }

  .option-header h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #1e40af;
  }

  .option-body {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .option-description {
    color: #6b7280;
    margin-bottom: 20px;
    flex-grow: 1;
  }

  .option-form {
    margin-top: auto;
  }

  .input-group {
    margin-bottom: 15px;
  }

  .input-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }

  .input-group input,
  .input-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 16px;
  }

  .button {
    display: inline-block;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
  }

  .button:hover {
    background-color: #1d4ed8;
  }

  .button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }

  .footer {
    text-align: center;
    padding: 20px;
    margin-top: 40px;
    color: #6b7280;
    font-size: 0.875rem;
    border-top: 1px solid #e5e7eb;
  }
</style>
