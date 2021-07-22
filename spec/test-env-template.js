// Define the ORSKEY for local tests.
// The same variable is defined in travis-ci to run automated tests
if (!process.env.ORSKEY) {
  process.env.ORSKEY = 'put-an-ors-key-here'
}
