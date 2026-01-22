const { spawnSync } = require('child_process');

const extractEmbedding = (imageUrl) => {
  const result = spawnSync(
    'python', // or 'python3'
    ['face-verification/extract_embedding_single.py', imageUrl],
    { encoding: 'utf-8' }
  );

  console.log("🐍 Python stdout:", result.stdout);
  console.log("🐍 Python stderr:", result.stderr);

  if (result.error) {
    throw result.error;
  }

  if (!result.stdout || result.stdout.trim() === '') {
    throw new Error('Python script did not return stdout');
  }

  const parsed = JSON.parse(result.stdout);
  return parsed.embedding;
};

module.exports = { extractEmbedding };
