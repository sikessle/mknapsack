# multidimensional knapsack 0-1 solver

For the course-work in AI2 by Ms. Rong Qu at the University of Applied Science Konstanz. The task was to design and implement a population
based algorithm to solve the knapsack problem with multiple constraints.
The benchmark which was used can be found under "See also" section. It
is the OR-library.

## Getting Started
- Run 'npm install'
- Run 'bower install'
- Run 'grunt watch' to recompile on change .less files

## Compatability
The solver should be fairly compatible with all major browser, however
there is no guarantee. It has been tested with Safari 7 and Firefox 29.
Some of functions use are ECMAScript 5+. Also it should work with all
modern mobile devices, due to bootstrap 3.

## Algorithm Details
The implemented algorithm is a genetic algorithm. It has been split
up in three modules: Evaluation (with domain knowledge), Population and
Reproduction. Have a look at the javascripts folder for more details.

### Problem representation
A solution is represented as an array of bits: [0, 1, 0, 0, ..]. Each
bit represents if the item is packed in (1) or not (0). A population
consists of multiple solution arrays: [ [0, 1], [1, 1], .. ].

### General Population Details
There are no double items and every solution in the population is
valid. The population size can be parameterized via the frontend.

### Initial Population
Consists of random valid solutions with packed/unpacked items uniformly
 distributed along the solution vector.

### Mutation
With probability p each new offspring (only if it is true offspring and
not just a clone, depending on the crossover probability) is mutated.
Mutation is performed by flipping one bit at a random position in the solution.

### Crossover

### Population Replacement
- initial population consists of random valid solutions with
packed/unpacked items uniformly distributed along the solution vector.
- the mutation accepts bad mutations.
- crossover technique: uniform-crossover with p=0.5
- population replacement method: replace-worst

## See also
For information about the benchmark, for which this algorithm is
designed, see
http://people.brunel.ac.uk/~mastjjb/jeb/orlib/mknapinfo.html

**You can have a look at a running live version at
http://sikessle.github.io/mknapsack**

## Caveats
There is not so much error checking so far. So if you create a too large
population the app will infinitely loop, as it tries to create the
population with no double solutions, which may not be possible anymore.
In general the following must hold: **s <= 2<sup>n</sup>,
n = number of variables, s = population size**
